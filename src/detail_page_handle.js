const Apify = require('apify'); // eslint-disable-line no-unused-vars
const Puppeteer = require('puppeteer'); // eslint-disable-line no-unused-vars
const MaxCrawledPlacesTracker = require('./helper-classes/max-crawled-places'); // eslint-disable-line no-unused-vars

const { ScrapingOptions, PlaceUserData } = require('./typedefs'); // eslint-disable-line no-unused-vars
const ErrorSnapshotter = require('./helper-classes/error-snapshotter'); // eslint-disable-line no-unused-vars
const Stats = require('./helper-classes/stats'); // eslint-disable-line no-unused-vars

const { extractPageData, extractPopularTimes, extractOpeningHours, extractPeopleAlsoSearch,
    extractAdditionalInfo } = require('./place-extractors/general');
const { extractImages } = require('./place-extractors/images');
const { extractReviews } = require('./place-extractors/reviews');
const { DEFAULT_TIMEOUT, PLACE_TITLE_SEL } = require('./consts');
const { waitForGoogleMapLoader, abortRunIfReachedMaxPlaces } = require('./utils/misc-utils');

const { log } = Apify.utils;

/**
 * @param {{
 *  page: Puppeteer.Page,
 *  request: Apify.Request,
 *  searchString: string,
 *  session: Apify.Session,
 *  scrapingOptions: ScrapingOptions,
 *  errorSnapshotter: ErrorSnapshotter,
 *  stats: Stats,
 *  maxCrawledPlacesTracker: MaxCrawledPlacesTracker,
 *  crawler: Apify.PuppeteerCrawler,
 * }} options
 */
module.exports.handlePlaceDetail = async (options) => {
    const {
        page, request, searchString, session, scrapingOptions, errorSnapshotter,
        stats, maxCrawledPlacesTracker, crawler
    } = options;
    const {
        includeHistogram, includeOpeningHours, includePeopleAlsoSearch,
        maxReviews, maxImages, additionalInfo, reviewsSort, reviewsTranslation,
        oneReviewPerRow, reviewsStartDate,
    } = scrapingOptions;
    // Extract basic information
    await waitForGoogleMapLoader(page);

    // Some customers are passing link to the reviews subpage for some reason
    const maybeBackButton = await page.$('button[aria-label="Back"]');
    if (maybeBackButton) {
        await maybeBackButton.click();
    }

    try {
        await page.waitForSelector(PLACE_TITLE_SEL, { timeout: DEFAULT_TIMEOUT });
    } catch (e) {
        session.markBad();
        throw 'The page header didn\'t load fast enough, this will be retried';
    }

    // Add info from listing page
    const { rank, searchPageUrl, isAdvertisement } = /** @type {PlaceUserData} */ (request.userData);

    // Extract gps from URL
    // We need to URL will be change, it happened asynchronously
    if (!maybeBackButton) {
        await page.waitForFunction(() => window.location.href.includes('/place/'));
    }
    const url = page.url();

    const coordinatesMatch = url.match(/!3d([0-9\-.]+)!4d([0-9\-.]+)/);
    const latMatch = coordinatesMatch ? coordinatesMatch[1] : null;
    const lngMatch = coordinatesMatch ? coordinatesMatch[2] : null;

    const coordinates = latMatch && lngMatch ? { lat: parseFloat(latMatch), lng: parseFloat(lngMatch) } : null;

    // This huge JSON contains mostly everything, we still don't use it fully
    // It seems to be stable over time
    // Examples can be found in the /samples folder
    // NOTE: This is empty for certain types of direct URLs
    // Search and place IDs work fine
    const jsonData = await page.evaluate(() => {
        try {
            // @ts-ignore
            return JSON.parse(APP_INITIALIZATION_STATE[3][6].replace(`)]}'`, ''))[6];
        } catch (e) {
        }
    });

    // Enable to debug data parsed from JSONs - DON'T FORGET TO REMOVE BEFORE PUSHING!
    /*
    await Apify.setValue('APP-OPTIONS', await page.evaluate(() => APP_OPTIONS ))
    await Apify.setValue('APP_INIT_STATE', await page.evaluate(() => APP_INITIALIZATION_STATE ));
    await Apify.setValue('JSON-DATA', jsonData);
    */    

    const pageData = await extractPageData({ page, jsonData });

    const gasPrices = jsonData?.[86]?.[0]?.map((/** @type {any} */ arr) => {
        /* expected raw array
        [
        "$4.10",
        3,
        1652829848,
        "gallon",
        1,
        "USD",
        4.1,
        "Regular"
        ],
        */
       return {
           priceTag: arr?.[0],
           updatedAt: new Date(arr?.[2] * 1000).toISOString(),
           unit: arr?.[3],
           currency: arr?.[5],
           price: arr?.[6],
           gasType: arr?.[7]
       }
    });

    let orderBy;
    // new format where food ordering represented by widget https://food.google.com/chooseprovider
    // TODO optional "Reserve a table" - https://www.google.com/maps/reserve/v/dine - same path, different URL
    try {
        const orderByWidget = jsonData?.[75]?.[0]?.find((/** @type {any} */ x) => x?.[5]?.[1]?.[2]?.[0]?.startsWith('https://food.google.com/chooseprovider'));
        if (orderByWidget) {
            const orderByWidgetUrl = orderByWidget[5]?.[1]?.[2]?.[0];
            const orderWidgetHtml = await page.evaluate(async (url) => {
                const data = await fetch(url).then((r) => r.text());
                return data;
            }, orderByWidgetUrl);
            // we getting two instances of AF_initDataCallback, first one looks like place info
            // we need
            // AF_initDataCallback({key: 'ds:1'
            const orderByInlineJsonData = orderWidgetHtml?.split(`AF_initDataCallback({key: 'ds:1'`)?.[1]?.split(', data:')?.[1]?.split(', sideChannel:')?.[0];
            if (orderByInlineJsonData) {
                log.debug(`[ORDERBY]: parsing widget ${orderByWidgetUrl}`);
            } else {
                log.warning(`[ORDERBY]: unknown widget format ${orderByWidgetUrl}`);
            }
            const orderByInlineJson = orderByInlineJsonData ? JSON.parse(orderByInlineJsonData) : {};
            let deliveryArray = orderByInlineJson?.[0];
            if (!deliveryArray) {
                deliveryArray = orderByInlineJson?.data?.[8];
                log.debug(`[ORDERBY]: delivery options not as expected ${orderByWidgetUrl}`);
            }
            if (deliveryArray?.[21]) {
                orderBy = deliveryArray?.[21]?.map((/** @type {any} */ x) => {
                    return {
                        name: x?.[3],
                        url: x?.[32],
                        orderUrl: x?.[49]
                    }

                });
            }
        }
    } catch (/** @type {any} */ err) {
        log.error(`[ORDERBY]: ${err?.message}`);
    }
    if (!orderBy?.length) {
        // old format with inline json values, displayed randomly by google maps as of 15 of May 2022
        orderBy = jsonData?.[75]?.[0]?.[0]?.[2]?.map((/** @type {any} */ i) => {
            return { name: i?.[0]?.[0], url: i?.[1]?.[2]?.[0] }
        }).filter((/** @type {any} */ x) => x?.url);
    }
    // if none of parsing returned results output must be empty array for backwards compatibility
    orderBy = orderBy || [];

    let totalScore = jsonData?.[4]?.[7] || null;
    let reviewsCount = jsonData?.[4]?.[8] || 0;
    let permanentlyClosed = (jsonData?.[88]?.[0] === "CLOSED" || jsonData?.[203]?.[1]?.[4]?.[0] === 'Permanently closed');

    // We fallback to HTML (might be good to do only)
    if (!totalScore) {
        totalScore = await page.evaluate(() => Number($(('[class*="section-star-display"]'))
            .eq(0).text().trim().replace(',', '.')) || null)
    }

    if (!reviewsCount) {
        reviewsCount = await page.evaluate(() => Number($('button[jsaction="pane.reviewChart.moreReviews"]')
            .text()
            .replace(/[^0-9]+/g, '')) || 0);
    }

    if (!permanentlyClosed) {
        permanentlyClosed = await page.evaluate(() => $('#pane,.skqShb').text().includes('Permanently closed'));
    }

    // TODO: Add a backup and figure out why some direct start URLs don't load jsonData
    // direct place IDs are fine
    const reviewsDistributionDefault = {
        oneStar: 0,
        twoStar: 0,
        threeStar: 0,
        fourStar: 0,
        fiveStar: 0,
    };

    let reviewsDistribution = reviewsDistributionDefault;

    if (jsonData) {
        if (Array.isArray(jsonData?.[52]?.[3])) {
            const [oneStar, twoStar, threeStar, fourStar, fiveStar] = jsonData[52][3];
            reviewsDistribution = { oneStar, twoStar, threeStar, fourStar, fiveStar };
        }
    }

    const defaultReviewsJson = jsonData?.[52]?.[0];

    let cid;
    const cidHexSplit = jsonData?.[10]?.split(':');
    if (cidHexSplit && cidHexSplit[1]) {
        // Hexadecimal to decimal. We have to use BigInt because JS Number does not have enough precision
        cid = BigInt(cidHexSplit[1]).toString();
    }    

    // How many we should scrape (otherwise we retry)
    const targetReviewsCount = Math.min(reviewsCount, maxReviews);

    // extract categories
    const categories = jsonData?.[13]

    const detail = {
        ...pageData,
        permanentlyClosed,
        totalScore,
        isAdvertisement,
        rank,
        placeId: jsonData?.[78] || request.uniqueKey,
        categories: request.userData.categories || categories,
        cid,
        url,
        searchPageUrl,
        searchString,
        // keeping backwards compatible even though coordinates is better name
        location: coordinates || pageData?.location?.lat ? pageData.location : null,
        scrapedAt: new Date().toISOString(),
        ...includeHistogram ? extractPopularTimes({ jsonData }) : {},
        openingHours: includeOpeningHours ? await extractOpeningHours({ page, jsonData }) : undefined,
        peopleAlsoSearch: includePeopleAlsoSearch ? await extractPeopleAlsoSearch({ page }) : undefined,
        additionalInfo: additionalInfo ? await extractAdditionalInfo({ page, placeUrl: url, jsonData }) : undefined,
        reviewsCount,
        reviewsDistribution,
        imagesCount: jsonData?.[37]?.[1],
        // IMPORTANT: The order of actions image -> reviews is important
        // If you need to change it, you need to check the implementations
        // and where the back buttons need to be 
        // NOTE: Image URLs are quite rare for users to require
        // In case the back button fails, we reload the page before reviews
        imageUrls: await errorSnapshotter.tryWithSnapshot(
            page,
            async () => extractImages({ page, maxImages, targetReviewsCount, placeUrl: url }),
            { name: 'Image extraction' },
        ),
        // NOTE: Reviews must be the last action on the detail page
        // because the back button is always a little buggy (unless you fix it :) ).
        // We want to close the page right after reviews are extracted
        reviews: await errorSnapshotter.tryWithSnapshot(
            page,
            async () => extractReviews({
                request,
                page,
                reviewsCount,
                targetReviewsCount,
                reviewsSort,
                reviewsTranslation,
                defaultReviewsJson,
                personalDataOptions: scrapingOptions.personalDataOptions,
                reviewsStartDate,
            }),
            { name: 'Reviews extraction' },
        ),
        orderBy,
        gasPrices,
    };
    
    if (oneReviewPerRow) {
        const unwoundResults = [];
        if (detail.reviews.length === 0) {
            // Removing reviews array from output
            unwoundResults.push({ ...detail, reviews: undefined });
        } else {
            for (const review of detail.reviews) {
                unwoundResults.push({ ...detail, ...review, reviews: undefined });
            }
        }
        await Apify.pushData(unwoundResults);
    } else {
        await Apify.pushData(detail);
    }
    
    stats.places();
    log.info(`[PLACE]: Place scraped successfully --- ${url}`);
    // We must not pass a searchString here because it aborts the whole run. We expect the global max to be correctly set.
    const shouldScrapeMore = maxCrawledPlacesTracker.setScraped();
    if (!shouldScrapeMore) {
        await abortRunIfReachedMaxPlaces({ searchString, request, page, crawler });
    }
};
