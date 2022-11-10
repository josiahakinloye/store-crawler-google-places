# 2022-11-10
*Features*
- Added `imagesCount` to output. It is displayed even if you don't extract their URLs.

# 2022-09-23
*Fixes*
- BREAKING CHANGE: Removed `maxCrawledPlaces` from input completely (use `maxCrawledPlacesPerSearch` instead)
- Fixed `maxCrawledPlacesPerSearch` leading to scraper being hang out in some cases

# 2022-09-06
*Fixes*
- Fixes unstable image extraction

# 2022-09-05
*Fixes*
- Final round of optimizations and fixes of the search process. The scraper is now probably the fastest is has ever been finally reaching about 100 places per 1 compute unit even with using geolocation.

# 2022-09-02
*Fixes*
- Several optimizations to speed up the search page (scrolling & enqueueing places)
- Fixed extraction of images

# 2022-08-16
*Fixes*
- Improve extraction of additional infos for hotels.

# 2022-08-15
*Fixes*
- Fixed actor sometimes finishing prematurely when there were still requests in the queue (caused by the new background enqueueing system)

# 2022-08-05
*Fixes*
- Fixed reviews duplications that sometimes happened.
- Fixed extraction of the temporarilyClosed field.

# 2022-08-03
*Fixes*
- Fixed reviews extraction. After Google's change, the scraper was giving only up to 10 reviews. Now it works fully again. `newest` doesn't sort properly though yet.

# 2022-07-21
*Fixes*
- Finish fast when less than 120 places are found on a page. Previous implementation waited several seconds extra.

# 2022-07-20
*Fixes*
- Search pages now use scrolling instead of pagination. This makes the crawling a little slower and reduces the maximum number of places per page from 400 to 120. Use geolocation with zoom to work around this reduction. We might increase the default zoom by 1. in the near future.

# 2022-05-19
*Features*
- Added `gasPrices` to output. Available only for gas stations in US to the best of our knowledge.

# 2022-05-02
*Fixes*
- subTitle extraction works now

# 2022-04-04
*Fixes*
- Blocked responses on the search page now properly retry the request (no more unhandled promise rejection)
- Smoother search page pagination
- More informative logs
- Fixed consent approval if browser crashes

# 2022-03-16
*Fixes*
- `maxCrawledPlaces` + `exportPlaceUrls` was giving inconsistent number of results.

# 2022-03-14
*Features*
- Added `allPlacesNoSearch` to input. This option allows you to scrape all places shown on the map without the need for any search term.
- Added `reviewsStartDate` to input to extract only reviews newer than this date.
- Added `radiusKm` to the `Point` type in `customGeolocation`

# 2022-03-04
*Improvement*
- `additionalInfo` extraction is faster now.
- `additionalInfo` extraction for hotels and similar categories is more complete now:
Data which is not displayed on the Google page but present in the Google response is also extracted.

# 2022-03-03
- Lowering the default zoom values. The past setup made the scraping too slow and costly. The new defaults will speed up the scraping a lot while missing only a few places. You can still manually override the `zoom` parameter. New default values are:
`country` or `state` -> 12
`county` -> 14
`city` -> 15
`postalCode` -> 16
no geolocation -> 12

# 2022-02-28
*Fixes*
- `location` extraction works in (almost) all cases now (search URLs and URLs with place IDs will always work).

# 2022-02-21
*Features*
- Added `oneReviewPerRow` to input to enable expanding reviews one per output row

# 2022-02-17
*Fixes*
- `openingHours` extraction works in almost all cases now (search URLs and URLs with place IDs will always work).

# 2022-01-12
- Start URLs now correctly work from uploaded CSV files or Google Sheets. It uses to trim part of the URL.

# 2022-01-11
- Changed `polygon` input field to `customGeolocation`
- Added deeper section into Reamde on how you can provide your own exact coordinates

# 2022-01-11
*Breaking changes*
We decided it is time to change several default parameters to make the user experience smoother. These changes should not have a big effect on currect users.

- `city` and other geolocation parameters will have preference over `lat` & `long` if both are used (*in 99% cases users want to use the automatic location splitting to get the most results which doesn't work with direct `lat` & `long`*)
- `zoom` will no longer have a default value 12. Instead, it will change based on geolocation type like this:

`country` or `state` -> 12
`county` -> 14
`city` -> 17
`postalCode` -> 18
no geolocation -> 12

Users will still be able to specify the zoom and override this behavior.

See [Readme](https://apify.com/drobnikj/crawler-google-places#automatic-zooming) for more details

## 2021-12-14
*Breaking change*
- `reviewsSort` is now set to `newest` by default. This is because some places don't yield all reviews on other sortings (we are not sure if this is a bug or silent block on Google's side)

## 2021-11-15
*Fixes*
- `exportPlaceUrls` now properly dedupes the URLs
- added `categories` fields listing all categories the place is listed in

## 2021-11-11
*Fixes*
- Fixed `additionalInfo` for hotels
- Fixed `exportPlaceUrls` not checking for correct geolocation

## 2021-11-09
*Fixes*
- `website` field now displays the full URL. This fixes issue of blank `facebook.com` links.

## 2021-11-05
*Fixes*
- Fixed new layout of `additionalInfo`

## 2021-11-03
*Fixes*
- Improved reliability of scraping place detail, reviews and images (improving scrolling and back button interaction)

## 2021-10-13
*Features*
- Added `menu` to output
- Added `price` to output

## 2021-10-07
*Fixes*
- Fixed `popularTimesHistogram` which caused crash on some pages

## 2021-09-27
*Fixes*
- Fixed image extraction & make it optional (it should not crash the whole scrape)

## 2021-09-15
*Fixes*
- Fixed `temporarilyClosed` and `permanentlyClosed`
- Added a step for normalizing input Start URLs because those with wrong format don't contain JSON data

## 2021-09-14
*Fixes*
- Fixed popular times live and histogram

## 2021-09-10
https://github.com/drobnikj/crawler-google-places/pull/185
https://github.com/drobnikj/crawler-google-places/issues/181

*Fixes*
-  In like 10% cases, the reviews are in wrong order and there is less of them. We didn't find a root cause yet but we retry the page so the output gets corrected.


## 2021-09-07
**Breaking fix**
- If you did not pass `maxReviews` in the input at all (`undefined`), it scraped 5 reviews as default. That was against the input schema description so it is now fixed to scrape 0 reviews in those cases.

## 2021-09-01
*Fixes*
- Fixed `placeId` extraction that was broken for some inputs
- Fixed missing `imageUrls`

*Features*
- Added option to input URLs with CID (Google My Business Listing ID) to start URLs, e.g. https://maps.google.com/?cid=12640514468890456789
- Added `cid` to output


## 2021-08-25
*Fixes*
- Fixed `maxCrawledPlaces` not finishing quickly for large country-wise searches. `maxCrawledPlacesPerSearch` still has this problem

## 2021-08-12
*Fixes*
- Fixed problem that `startUrls` was not picking up all provided URLs sometimes (due to automatic `uniqueKey` resolution)
- `likesCount` in reviews

## 2021-08-06
*Fixes*
- `maxCrawledPlaces` now compares to total sum of all places

*Features*
- Added `maxCrawledPlacesPerSearch` to limit max places per search term or search URL

## 2021-07-26
*Fixes*
- Address is now parsed correctly into components even when you supply direct place IDs

- Migrated code from `apify` 0.22.5 to 1.3.1

## 2021-07-13
- Added `county` to geolocation options

## 2021-06-03
*Fixes*
(hopefully last fixes after the layout change)
- Scraping all images per place works again
- Fixed `additionalInfo`
- Fixed `openiningHours`

## 2021-06-03
*Fixes*
- Fix handling of search pages without results
- Skip empty searches that sometimes users accidentally post

## 2021-05-25
*Features*
- Added orderBy attribute to result scrape

## 2021-05-18
*Fixes*
- Fully or partially fixed consent screen issues
- Should also help with `Failed to set the 'innerHTML' property on 'Element': This document requires 'TrustedHTML' assignment.` which is caused by injecting JQuery into constent screen

## 2021-04-29
*Fixes*
- Fixed `reviewsTranslation`

## 2021-04-28
*Fixes after Google changed layout, not everything was fixed. Next batch of fixed asap!*
- Fixed additional data
- Fixed search pagination getting into infinite loop
- Fixed empty search handling
- Fixed reviews not being scraped
- Fixed `totalScore`

## 2021-03-22
**Warning** - Next version will be a breaking one as we will remove personal data from reviews by default. You will have to explicitly enable the fields below.
*Features*
- Added input fields to selectively pick which personal data fields to scrape - `scrapeReviewerName`, `scrapeReviewerId`, `scrapeReviewerUrl`, `scrapeReviewId`, `scrapeReviewUrl`, `scrapeResponseFromOwnerText`

## 2021-03-17
*Fixes*
- Removed duplicate reviews + all reviews scraped correctly
- `reviewsSort` finally works correctly
- Reviews scraping is now significantly faster
- Handle error that irregularly happened when scraping huge amount of reviews

*Features*
- Added `reviewsDistribution`
- Added `publishedAtDate` (exact date), `responseFromOwnerDate` and `responseFromOwnerText `for each review

## 2021-03-10
Fixes:
- `totalScore` and `reviewsCount` are now correctly extracted for all languages
- `startUrls` now correctly work non-.com domains and on detail places

## 2021-02-02
Fixes:
- Search keyword that links only to a single place (like `"London Eye"`) now works correctly

## 2021-01-27
Features:
- Address is parsed into `neighborhood`, `street`, `city`, `postalCode`, `state` and `countryCode` fields
- Added `reviewsTranslation` option to adjust how Google translates reviews from non-English languages
- Parsing ads. This means a bit more results. Those that are ads have `"isAdvertisement": true` field.
- Added `useCachedPlaces` option to load places from your KV Store. Useful if you need to scrape the same places regularly.
- Added `polygon` option to provide your own geolocation polygon.

Fixes:
- This one is big. We removed the infamous `Place is outside of required location (polygon)` error. The location of a place is now checked during paginating and these places are skipped. This means a **massive speed up of the scraper**.

## 2021-01-11
Features:
- Automatic screenshots of errors to see what went wrong
- Added `searchPageUrl` to output
- Added `PLACES-OUT-OF-POLYOGON` record to Key-Value store. You can check what places were excluded.

Fixes:
- Fixed rare bug with saving stats
- Improvement in review sorting - but it is still not ideal, more work needs to be done

## 2020-11-16
- Added postal code geolocation to input
- Improved errors when location is not found
- Optimization - Removed geolocation data from intermediate requests

## 2020-10-29
- Fixed handling of Google consent screen
- Better input validation and deprecation logs
- Changed default for `maxImages` to `1` as it doesn't require scrolling for the main image
- `imageUrls` are returned with the highest resolution

## 2020-10-27
- Removed `forceEng` input in favor of `language`

## 2020-10-15
- The default setup now uses `maxImages: 0` and `maxReviews: 0` to improve efficiency

## 2020-10-01
- added several browser options to input - `maxConcurrency`, `maxPageRetries`, `pageLoadTimeoutSec`, `maxPagesPerBrowser`, `useChrome`
- rewamped input schema and readme
- Added `reviewerNumberOfReviews` and `isLocalGuide` to reviews

## 2020-09-22
- added few extra review fields (ID, URL)

## 2020-07-23 small features
### New features
 - add an option for caching place location
 - add an option for sorting of reviews
 - add stats logging

## 2020-07 polygon search and bug fixes
### breaking change
 - reworked input search string

### Bug fixes
 - opening hour parsing (#39)
 - separate locatedIn field (#32)
 - update readme

### New features
 - extract additional info - Service Options, Highlights, Offerings,.. (#41)
 - add `maxReviews`, `maxImages` (#40)
 - add `temporarilyClosed` and `permanentlyClosed` flags (#33)
 - allow to scrape only places urls (#29)
 - add `forceEnglish` flag into input (#24, #21)
 - add searching in polygon using nominatim.org
 - add startUrls
 - added `maxAutomaticZoomOut` to limit how far can Google zoom out (it naturally zooms out as you press next page in search)

