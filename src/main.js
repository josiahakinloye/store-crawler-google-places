const Apify = require('apify');

const typedefs = require('./typedefs'); // eslint-disable-line no-unused-vars
const { PersonalDataOptions } = require('./typedefs');

const placesCrawler = require('./places_crawler');
const Stats = require('./helper-classes/stats');
const ErrorSnapshotter = require('./helper-classes/error-snapshotter');
const PlacesCache = require('./helper-classes/places_cache');
const MaxCrawledPlacesTracker = require('./helper-classes/max-crawled-places');
const ExportUrlsDeduper = require('./helper-classes/export-urls-deduper');
const { prepareSearchUrlsAndGeo } = require('./utils/search');
const { createStartRequestsWithWalker } = require('./utils/walker');
const { makeInputBackwardsCompatible, validateInput, getValidStartRequests, adjustInput } = require('./utils/input-validation');
const { parseRequestsFromStartUrls } = require('./utils/misc-utils');
const { setUpEnqueueingInBackground } = require('./utils/background-enqueue');
const { LABELS } = require('./consts');

const { log } = Apify.utils;

// NOTE: This scraper is mostly typed with Typescript lint.
// We had to do few ugly things because of that but hopefully it is worth it.

Apify.main(async () => {
    const input = /** @type {typedefs.Input} */ (await Apify.getInput());

    makeInputBackwardsCompatible(input);
    validateInput(input);
    adjustInput(input);

    const {
        // Search and Start URLs
        startUrls = [], searchStringsArray = [], allPlacesNoSearchAction = '',
        // Geolocation (country is deprecated but we will leave for a long time)
        lat, lng, country, countryCode, state, county, city, postalCode, zoom, customGeolocation,
        // browser and request options
        pageLoadTimeoutSec = 60, useChrome = false, maxConcurrency, maxPagesPerBrowser = 10, maxPageRetries = 6,
        // Misc
        proxyConfig, debug = false, language = 'en', headless = true,
        // walker is undocumented feature added by jakubdrobnik, we need to test it and document it
        walker,

        // Scraping options
        includeHistogram = false, includeOpeningHours = false, includePeopleAlsoSearch = false,
        maxReviews = 0, maxImages = 0, exportPlaceUrls = false, additionalInfo = false,

        maxCrawledPlacesPerSearch = 9999999,

        maxAutomaticZoomOut, reviewsTranslation = 'originalAndTranslated', oneReviewPerRow = false,
        // For some rare places, Google doesn't show all reviews unless in newest sorting
        reviewsSort = 'newest', reviewsStartDate,
        // Fields used by Heyrick only, not present in the schema (too narrow use-case for now)
        cachePlaces = false, useCachedPlaces = false, cacheKey = '',

        // Personal data
        scrapeReviewerName = true, scrapeReviewerId = true, scrapeReviewerUrl = true,
        scrapeReviewId = true, scrapeReviewUrl = true, scrapeResponseFromOwnerText = true,

    } = input;

    if (debug) {
        log.setLevel(log.LEVELS.DEBUG);
    }

    // Initializing all the supportive classes in this block

    const stats = new Stats();
    await stats.initialize(Apify.events);

    const errorSnapshotter = new ErrorSnapshotter();
    await errorSnapshotter.initialize(Apify.events);

    // Only used for Heyrick. By default, this is not used and the functions are no-ops
    const placesCache = new PlacesCache({ cachePlaces, cacheKey, useCachedPlaces });
    await placesCache.initialize();

    /** @type {ExportUrlsDeduper | undefined} */
    let exportUrlsDeduper;
    if (exportPlaceUrls) {
        exportUrlsDeduper = new ExportUrlsDeduper();
        await exportUrlsDeduper.initialize(Apify.events);
    }

    // Requests that are used in the queue, we persist them to skip this step after migration
    const startRequests = /** @type {Apify.RequestOptions[]} */ (await Apify.getValue('START-REQUESTS')) || [];

    const requestQueue = await Apify.openRequestQueue();

    // We declare geolocation as top level variable so it is constructed only once in memory,
    // persisted and then used to check all requests
    let geolocation;
    let startUrlSearches;
    // We crate geolocation only for search. not for Start URLs
    if (startUrls.length === 0) {
        // This call is async because it persists geolocation into KV
        ({ startUrlSearches, geolocation } = await prepareSearchUrlsAndGeo({
            lat,
            lng,
            userOverridingZoom: zoom,
            // country is deprecated but we use it for backwards compatibility
            // our search works the same with code or full name
            country: countryCode || country,
            state,
            county,
            city,
            postalCode,
            customGeolocation,
        }));
    }

    if (allPlacesNoSearchAction) {
        if (searchStringsArray?.length > 0) {
            log.warning(`You cannot use search terms with allPlacesNoSearch option. Clearing them out.`)
            searchStringsArray.length = 0;
        }
        searchStringsArray?.push(allPlacesNoSearchAction);
    }

    if (startRequests.length === 0) {
        // Start URLs have higher preference than search
        if (startUrls.length > 0) {
            if (searchStringsArray?.length) {
                log.warning('\n\n------\nUsing Start URLs disables search. You can use either search or Start URLs.\n------\n');
            }
            // Apify has a tendency to strip part of URL for uniqueKey for Google Maps URLs

            const updatedStartUrls = await parseRequestsFromStartUrls(startUrls);
            const validStartRequests = getValidStartRequests(updatedStartUrls);
            validStartRequests.forEach((req) => startRequests.push(req));
        } else if (searchStringsArray?.length) {
            for (const searchString of searchStringsArray) {
                // Sometimes users accidentally pass empty strings
                if (typeof searchString !== 'string' || !searchString.trim()) {
                    log.warning(`WRONG INPUT: Search "${searchString}" is not a valid search, skipping`);
                    continue;
                }
                // TODO: walker is not documented!!! We should figure out if it is useful at all
                if (walker) {
                    const walkerGeneratedRequests = createStartRequestsWithWalker({ walker, searchString });
                    for (const req of walkerGeneratedRequests) {
                        startRequests.push(req);
                    }
                } else if (searchString.includes('place_id:')) {
                    /**
                     * User can use place_id:<Google place ID> as search query
                     */
                    const cleanSearch = searchString.replace(/\s+/g, '');
                    // @ts-ignore We know this is correct
                    const placeId = cleanSearch.match(/place_id:(.*)/)[1];
                    startRequests.push({
                        url: `https://www.google.com/maps/search/?api=1&query=${cleanSearch}&query_place_id=${placeId}`,
                        uniqueKey: placeId,
                        userData: { label: LABELS.PLACE, searchString },
                    });
                } else if (startUrlSearches) {
                    // For each search, we use the geolocated URLs
                    for (const startUrlSearch of startUrlSearches) {
                        const urlWithSearchString = searchString.startsWith('all_places_no_search')
                            ? startUrlSearch
                            : `${startUrlSearch}/${searchString}`;
                        startRequests.push({
                            url: urlWithSearchString,
                            uniqueKey: urlWithSearchString,
                            userData: { label: LABELS.SEARCH, searchString },
                        });
                    }
                }
            }

            // use cached place ids for geolocation
            for (const placeId of placesCache.placesInPolygon(geolocation, maxCrawledPlacesPerSearch * searchStringsArray.length, searchStringsArray)) {
                const searchString = searchStringsArray.filter(x => placesCache.place(placeId)?.keywords.includes(x))[0];
                startRequests.push({
                    url: `https://www.google.com/maps/search/?api=1&query=${searchString}&query_place_id=${placeId}`,
                    uniqueKey: placeId,
                    userData: { label: LABELS.PLACE, searchString, rank: null },
                });
            }
        }

        log.info(`Prepared ${startRequests.length} Start URLs (showing max 10):`);
        console.dir(startRequests.map((r) => r.url).slice(0, 10));

        await Apify.setValue('START-REQUESTS', startRequests);
        const apifyPlatformKVLink = 'link: https://api.apify.com/v2/key-value-stores/'
            + `${Apify.getEnv().defaultKeyValueStoreId}/records/START-REQUESTS?disableRedirect=true`;
        const localLink = 'local disk: apify_storage/key_value_stores/default/START-REQUESTS.json';
        // @ts-ignore Missing type in SDK
        const link = Apify.getEnv().isAtHome ? apifyPlatformKVLink : localLink;
        log.info(`Full list of Start URLs is available on ${link}`);
    } else {
        log.warning('Actor was restarted, skipping search step because it was already done...');
    }

    // We have to define this class here because we can expand new requests during the preparation
    const maxCrawledPlaces = (searchStringsArray.length || startRequests.length) * maxCrawledPlacesPerSearch;
    const maxCrawledPlacesTracker = new MaxCrawledPlacesTracker(maxCrawledPlaces, maxCrawledPlacesPerSearch);
    await maxCrawledPlacesTracker.initialize(Apify.events);

    // We enqueue small part of initial requests now and the rest in background
    await setUpEnqueueingInBackground(startRequests, requestQueue, maxCrawledPlacesTracker);

    const proxyConfiguration = await Apify.createProxyConfiguration(proxyConfig);

    /** @type {typedefs.CrawlerOptions} */
    const crawlerOptions = {
        requestQueue,
        proxyConfiguration,
        maxConcurrency,
        useSessionPool: true,
        persistCookiesPerSession: true,
        // This is just passed to gotoFunction
        pageLoadTimeoutSec,
        // long timeout, because of long infinite scroll
        handlePageTimeoutSecs: 30 * 60,
        maxRequestRetries: maxPageRetries,
        // NOTE: Before 1.0, there was useIncognitoPages: true, let's hope it was not needed
        browserPoolOptions: {
            maxOpenPagesPerBrowser: maxPagesPerBrowser,
            useFingerprints: true,
        },
        launchContext: {
            useChrome,
            launchOptions: {
                headless,
                args: [
                    // this is needed to access cross-domain iframes
                    '--disable-web-security',
                    '--disable-features=IsolateOrigins,site-per-process',
                    `--lang=${language}`, // force language at browser level
                ],
            }
        },
    };

    /** @type {PersonalDataOptions} */
    const personalDataOptions = {
        scrapeReviewerName, scrapeReviewerId, scrapeReviewerUrl, scrapeReviewId,
        scrapeReviewUrl, scrapeResponseFromOwnerText,
    }

    /** @type {typedefs.ScrapingOptions} */
    const scrapingOptions = {
        includeHistogram, includeOpeningHours, includePeopleAlsoSearch,
        maxReviews, maxImages, exportPlaceUrls, additionalInfo,
        maxAutomaticZoomOut, reviewsSort, language, reviewsStartDate,
        geolocation, reviewsTranslation,
        personalDataOptions, oneReviewPerRow,
        allPlacesNoSearchAction
    };

    /** @type {typedefs.HelperClasses} */
    const helperClasses = {
        stats, errorSnapshotter, maxCrawledPlacesTracker, placesCache, exportUrlsDeduper,
    };

    // Create and run crawler
    const crawler = placesCrawler.setUpCrawler({ crawlerOptions, scrapingOptions, helperClasses });

    await crawler.run();
    await stats.saveStats();
    await placesCache.savePlaces();
    await maxCrawledPlacesTracker.persist();

    log.info('Scraping finished!');
});
