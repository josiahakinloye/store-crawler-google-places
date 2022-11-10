## What is Google Maps Scraper what does it do?

This Google Maps scraper lets you get more and faster data from Google Places than the official [Google Places API](https://developers.google.com/places/web-service/search). Our unofficial Google Maps API enables you to extract all of the following data from Google Maps:

🔗   Title, subtitle, category, place ID, and URL

📍   Address, location, plus code and exact coordinates

☎️   Phone and website, if available

🏷   Menu and price, if available

🔒   Temporarily or permanently closed status

⌚️  Popular times - histogram & live occupancy

⭐️   Average rating (`totalScore`), review count, and review distribution

🍔   List of images (optional)

➕   List of detailed characteristics (`additionalInfo`, optional)

🧑‍🍳   Opening hours (optional)

🔍   People also search (optional)

The scraper also supports the scraping of all **detailed information about reviews**:

✅   Review text

✅   Published date

✅   Stars

✅   Review ID & URL

✅   Response from owner - text and published date

Personal data extraction about reviewers has to be **explicitly** enabled in input (see  [Personal data section](https://apify.com/drobnikj/crawler-google-places#personal-data)):

-   Reviewer name
-   Reviewer ID & URL
-   Reviewer number of reviews
-   Is Local Guide

Google Maps Scraper also provides **other handy features**:

🗺   Define search area - allows you to define the geographical area to scrape to a country, state, county, city, or postal code, thus speeding up the search (integration with Nomatim Maps API)

🔍   Automatic zooming - ensures maximum results

🌏   Language & translation settings

🗂   Reviews sorting

🛡   Proxy configuration

💻   Browser & scraping configuration


## How does  Google Maps Scraper work?

It works exactly as if you were searching through Google Maps and copying information from each page you find. It opens  [Google Maps website](https://www.google.com/maps/), goes to a specified location, then writes your search query into the search bar. Then it presses the *Next page* button until it reaches the final page or  `maxCrawledPlaces`. It enqueues all the places as separate pages and then copypastes all visible data into an organized document. To understand the process fully, just try it out in your browser - the scraper does exactly the same thing, only much faster.

## How much will scraping Google Maps cost?

Apify provides you with $5 free usage credits to use every month on the Apify Free plan, and you could get **up to 2,000 reviews from this Google Maps Scraper** for those credits. But the number of platform credits you use **depends on the complexity of your search**. 

If you need to get more data regularly, you should grab an Apify subscription. We recommend our $49/month Personal plan - you can get **up to 20,000 Google Maps results every month** with the free $49 in monthly usage credits from that plan! For more details about usage credits, see this video guide on ▷ [how to choose the right subscription plan](https://www.youtube.com/watch?v=s_89WpOsKRI).

For more details about Google Maps scraper usage, see the [Cost of usage tab](https://apify.com/drobnikj/crawler-google-places/cost-of-usage#features). 
<a href="https://console.apify.com/actors/nwua9Gu5YrADL7ZDj" target="_blank">  
<img width="20%" src="https://imgur.com/FS6hnof.png"/> </a>

## What are the advantages over the Google Maps API?

With the Google Maps API, you get $200 worth of credit usage every month free of charge. That means 28,500 maploads per month. However, the **Google Maps API caps your search results to 60**, regardless of the radius you specify. So, if you want to scrape data for bars in New York, for example, you'll get results for only 60 of the thousands of bars in the area. 

**Google Maps Scraper imposes no rate limits or quotas** and provides more cost-effective, comprehensive results, and also scrapes histograms for popular times, which aren't available in the official API.


## Is it legal to scrape Google Maps?

Web scraping is legal if you are extracting publicly available data which is most data on Google Maps. However, you should respect boundaries such as personal data and intellectual property regulations. You should only scrape personal data if you have a legitimate reason to do so, and you should also factor in Google's [Terms of Use](https://policies.google.com/terms?hl=en).


## How do I use Google Maps Scraper?

To understand how to configure and run the scraper, follow our step-by-step guide on  [how to scrape Google Maps](https://blog.apify.com/step-by-step-guide-to-scraping-google-maps/) or [watch a short video tutorial](https://www.youtube.com/watch?v=Wzfo3qSSbtU)  &#9655; on YouTube. 

[![Apify - G Maps](https://img.youtube.com/vi/J43AX9wu-NI/0.jpg)](https://www.youtube.com/watch?v=J43AX9wu-NI)

## What can I use the extracted data from Google Maps for?

You can use the extracted data to:

👉🏽 create a potential customer base and prospection files

👉🏽 find new clients

👉🏽 generate leads

👉🏽 search and analyze businesses similar to yours

👉🏽 monitor brand sentiment and service quality, and identify fake reviews

👉🏽 find where to buy products

👉🏽 analyze geo-spatial data for scientific or engineering work

👉🏽 develop a working market strategy

For more ideas on how to use the extracted data, check out our [industries pages](https://apify.com/industries)  for concrete ways web scraping results are already being used across many projects and businesses of all types and sizes - in [travel and logistics](https://apify.com/industries/travel-and-logistics), for instance.


## Want more options?

### Google Maps Reviews Scraper ⭐️

If you only want to scrape reviews, this targeted data scraper is a great option. [Google Maps Reviews Scraper](https://apify.com/zenisjan/google-maps-reviews-scraper) extracts all reviews for a single place on Google Maps. 

All you need to do is enter the URL of the location you want to scrape, and you'll get a dataset of all reviews, which you can download for business analysis and market research.

### Easy Google Maps Scraper 🌎

If you want an easier but more limited Google Maps scraping tool, this is a very handy scraper if you're only looking to extract, say, 40 results rather than 400. [Google Maps Reviews Scraper](https://apify.com/zenisjan/google-maps-reviews-scraper) is set up and configured to make your scraping tasks super quick and easy.

### Google Places API Radar Search📍

To use this tool, you need to acquire your own Google API key, as you would use the official Google API. So, why use [Google Places API Radar Search](https://apify.com/alexey/google-maps-radar-search) instead of the API?

Nearby search with the official API returns only 60 results. Google Places API Radar Search overrides this limit and gets all places in a specified location.

### Gas Prices Scraper ⛽️

Use [Gas Prices Scraper](https://apify.com/natasha.lekh/gas-prices-scraper) to find the lowest gas prices and timestamps of price updates from gas stations in your area.
       

## Input

### Input example
The Google Maps Scraper has the following input options:

![Apify  -  G Maps  Scraper  input](https://i.imgur.com/AxyIJG2.png)

Or here's its equivalent in JSON:
```json
{
  "maxCrawledPlaces": 10,
  "language": "en",
  "exportPlaceUrls": false,
  "includeHistogram": false,
  "includeOpeningHours": false,
  "includePeopleAlsoSearch": false,
  "additionalInfo": false,
  "maxImages": 10,
  "maxReviews": 0,
  "scrapeReviewerName": true,
  "scrapeReviewerId": true,
  "scrapeReviewerUrl": true,
  "scrapeReviewId": true,
  "scrapeReviewUrl": true,
  "scrapeResponseFromOwnerText": true,
  "proxyConfig": {
    "useApifyProxy": true
  },
  "maxCrawledPlacesPerSearch": 10,
  "searchStringsArray": [
    "pet shelter in Prague"
  ],
  "oneReviewPerRow": false,
  "reviewsSort": "newest",
  "reviewsTranslation": "originalAndTranslated",
  "allPlacesNoSearchAction": ""
}
```
<a href="https://console.apify.com/actors/nwua9Gu5YrADL7ZDj" target="_blank">  
<img width="20%" src="https://imgur.com/FS6hnof.png"/> </a>

## Output

The output from Google Maps Scraper is stored in a dataset. After the run is finished, you can download the dataset in various data formats (JSON, CSV, XML, RSS, HTML Table).

### Output example

![Apify  -  G Maps  Scraper  input](https://i.imgur.com/RaeEvdb.png)

Or here's its equivalent in JSON:
``` json 
[{
  "title": "Pet Heroes shop",
  "subTitle": "Pet Heroes - pomáháme zvířatům",
  "price": null,
  "menu": null,
  "categoryName": "Non-governmental organization",
  "address": "V Horkách 4, 140 00 Praha 4-Nusle, Czechia",
  "locatedIn": null,
  "neighborhood": "V Horkách 4",
  "street": "V Horkách 4",
  "city": "Prague 4-Nusle",
  "postalCode": "140 00",
  "state": null,
  "countryCode": "CZ",
  "plusCode": "3C6W+MR Prague 4, Czechia",
  "website": "http://www.petheroes.cz/",
  "phone": "+420 725 723 947",
  "temporarilyClosed": false,
  "location": {
    "lat": 50.0616625,
    "lng": 14.4470878
  },
  "permanentlyClosed": false,
  "totalScore": 4.8,
  "isAdvertisement": false,
  "rank": 10,
  "placeId": "ChIJJXTKRpmVC0cREdfm_mnO1e8",
  "categories": [
    "Non-governmental organization"
  ],
  "cid": "17281946099747575569",
  "url": "https://www.google.com/maps/place/Pet+Heroes+shop/@50.0616625,14.4470878,17z/data=!3m1!4b1!4m5!3m4!1s0x470b959946ca7425:0xefd5ce69fee6d711!8m2!3d50.0616625!4d14.4470878?hl=en",
  "searchPageUrl": "https://www.google.com/maps/search/pet+shelter+in+Prague/@37.6,-95.665,4z?hl=en",
  "searchString": "pet shelter in Prague",
  "scrapedAt": "2022-07-28T12:41:14.352Z",
  "reviewsCount": 17,
  "reviewsDistribution": {
    "oneStar": 0,
    "twoStar": 1,
    "threeStar": 0,
    "fourStar": 0,
    "fiveStar": 16
  },
  "imagesCount": 34,
  "imageUrls": [
    "https://lh5.googleusercontent.com/p/AF1QipO5KXrDiwPABpf329swB-ZqgNNbwSXt2EXdcb1C=w1920-h1080-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipMsy8BCwkMD8WJCNr4Qce98Tt_lLN_l1Tt1NhvI=w1920-h1080-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipPZbx-sQF7GlQ3iHvPZ7vPJmwSg3GmTjZwjcsAJ=w1920-h1080-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipO_S2d-hodZ7P1Ua_OUFNr7FOWIm02GeBAmnK8f=w1920-h1080-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipOte-mza93xiqM60Hbm9wQaExi7J6gyLOo53K2r=w1920-h1080-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipOUpt1d4TDfdXK5owjTANfYQfLG1dvAJRnwI8kg=w1920-h1080-k-no"
  ],
  "reviews": [],
  "orderBy": []
},
{
  "title": "Sdružení na ochranu zvířat v krajní nouzi",
  "subTitle": null,
  "price": null,
  "menu": null,
  "categoryName": "Pet adoption service",
  "address": "Na Pláni 2006, 150 00 Praha 5, Czechia",
  "locatedIn": null,
  "neighborhood": "Na Pláni 2006",
  "street": "Na Pláni 2006",
  "city": "Prague 5",
  "postalCode": "150 00",
  "state": null,
  "countryCode": "CZ",
  "plusCode": "397W+49 Prague 5, Czechia",
  "website": "https://www.kocici-utulek.cz/",
  "phone": "+420 603 225 948",
  "temporarilyClosed": false,
  "location": {
    "lat": 50.062872,
    "lng": 14.3958755
  },
  "permanentlyClosed": false,
  "totalScore": 4.3,
  "isAdvertisement": false,
  "rank": 9,
  "placeId": "ChIJuxlGAU6UC0cRI_jkTCUIboA",
  "categories": [
    "Pet adoption service"
  ],
  "cid": "9254343240589834275",
  "url": "https://www.google.com/maps/place/Sdru%C5%BEen%C3%AD+na+ochranu+zv%C3%AD%C5%99at+v+krajn%C3%AD+nouzi/@50.062872,14.3958755,17z/data=!3m1!4b1!4m5!3m4!1s0x470b944e014619bb:0x806e08254ce4f823!8m2!3d50.0628787!4d14.3958708?hl=en",
  "searchPageUrl": "https://www.google.com/maps/search/pet+shelter+in+Prague/@37.6,-95.665,4z?hl=en",
  "searchString": "pet shelter in Prague",
  "scrapedAt": "2022-07-28T12:42:10.969Z",
  "reviewsCount": 40,
  "reviewsDistribution": {
    "oneStar": 6,
    "twoStar": 0,
    "threeStar": 1,
    "fourStar": 2,
    "fiveStar": 31
  },
  "imageUrls": [
    "https://lh5.googleusercontent.com/p/AF1QipOeEWgXD8Jjmj3DpIa7U9VeJ3E83xaRpefxbYZh=w1920-h1080-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipN2XNEQQrjtpMIHLe0WlJHYWd4nhniifUiy9BYq=w1920-h1080-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipOShH8UZgA-gtJlc83n2uBLhgkd5HRacPIOx_V6=w1920-h1080-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipPrcwuF0i7y32PUwX-ff-jdkRovD7XQ6fmBWHmr=w1920-h1080-k-no"
  ],
  "reviews": [],
  "orderBy": []
},
```

## Tips and tricks: define search area

### Country, state, county, city, and postal code vs. latitude and longitude

You can speed up the search and consume fewer platform credits by reducing the radius of the geographical area to scrape. You can use any combination of the geolocation parameters: `country`, `state`, `county`,  `city` & `postalCode`.

Keep in mind that the first five fields and the coordinate options are mutually exclusive.

### Automatic zooming

The scraper automatically zooms the map to ensure maximum results are extracted. Higher  zoom ensures more (less known) places are scraped. Logically, the smaller the area is, the higher zoom should be used. Currently, the default `zoom` values are:

- no geolocation -> 12
- `country` or `state` -> 12
- `county` -> 14 
-  `city` -> 15
- `postalCode` -> 16

If you need even more results or a faster run, you can override these values with the `zoom` input parameter. `zoom` can be any number between 1 (whole globe) and 21 (few houses).

### Custom search area

If your location can’t be found or you want to customize it, you can use the custom search area function for the creation of start URLs. As an example, see the `geojson field` in [Nominatim Api](https://nominatim.openstreetmap.org/) (see [here for the example of Cambridge in Great Britain](https://nominatim.openstreetmap.org/search?country=united%20kingdom&state=&city=cambridge&postalcode=&format=json&polygon_geojson=1&limit=1&polygon_threshold=0.005)).
There are several types of search area geometry that you can use. All follow official [Geo Json RFC](https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.2).

**Polygon**

The most common type is polygon, which is a set of points that define the location.  The first and last coordinate must be equal **(to close the polygon)**. `customGeolocation` should have this format:
```json
{
    "type": "Polygon",
    "coordinates": [
        [
            [
                // Must be the same as last one
                0.0686389, // Longitude
                52.2161086 // Latitude
            ],
            [
                0.1046861,
                52.1906436
            ],
            [
                0.0981038,
                52.1805451
            ],
            [
                0.1078243,
                52.16831
            ],
            [
                // Must be the same as first one
                0.0686389, 
                52.2161086
            ]
        // ...
        ]
    ]
}

### [](https://github.com/drobnikj/crawler-google-places/tree/0704f9bbd6eb8bc935ade339b16f4e59cf8c0a64#multipolygon)MultiPolygon

Multi polygon can combine more polygons that are not continuous together.

{
    "type": "MultiPolygon",
    "coordinates": [
        [ // first polygon
            [
                [
                    12.0905752, // Longitude
                    50.2524063  // Latitude
                ],
                [
                    12.1269337,
                    50.2324336
                ],
                // ...
            ]
        ],
        [
            // second polygon
            // ...
        ]
    ]
}
```



**MultiPolygon**

MultiPolygon can combine more polygons that are not continuous together.
```json
{
    "type": "MultiPolygon",
    "coordinates": [
        [ // first polygon
            [
                [
                    12.0905752, // Longitude
                    50.2524063  // Latitude
                ],
                [
                    12.1269337,
                    50.2324336
                ],
                // ...
            ]
        ],
        [
            // second polygon
            // ...
        ]
    ]
}
```

**Circle**

For a circle, we can use the `Point` type with our custom parameter `radiusKm`.
```json
{
    "type": "Point",
    "coordinates": ["7.5503", "47.5590"],
    "radiusKm": 1
}
```
## Advanced configuration

### One review per row

Normally, each result item contains data about a single place. Each item is displayed as one row in tabulated formats. There is a lot of data about each place, so the tabulated formats get very messy and hard to analyze. Fortunately, there is a solution.

**You can tick on the  `oneReviewPerRow`  input toggle to get one review per row as output.** If you already have a dataset and need to adjust its format, read further.

For example, if you need to analyze reviews, you can configure the download to only contain the data you need and adjust the row/column format. Here's how to get a list of reviews with a place title one review per row: copy the download link in the format you need, paste it to a different tab, and add  `&unwind=reviews&fields=reviews,title`  to the end of the link URL, and then press Enter to download it.  `unwind=reviews`  means that each review will be on its own row.  `fields=reviews,title`  means that only reviews and title will be downloaded, skipping the other data. Otherwise, the output would be very big, but it's also no problem if you don't use  `fields`  at all.

The whole download link for, e.g. CSV would look like this (with dataset ID):[https://api.apify.com/v2/datasets/DATASET_ID/items?clean=true&format=csv&attachment=true&unwind=reviews&fields=reviews,title](https://api.apify.com/v2/datasets/dataset_id/items?clean=true&format=csv&attachment=true&unwind=reviews&fields=reviews,title)


### Changelog
This scraper is under active development. We are always implementing new features and fixing bugs. If you would like to see a new feature, please submit an issue on GitHub. Check  [CHANGELOG.md](https://github.com/drobnikj/crawler-google-places/blob/master/CHANGELOG.md) for a list of recent updates.

## Resources on how to scrape Google Maps


>- [Step-by-step guide](https://blog.apify.com/step-by-step-guide-to-scraping-google-maps/) on how to use Google Maps Scraper. 
>- [Video tutorial ▷](https://www.youtube.com/watch?v=J43AX9wu-NI) on how to use Google Maps Scraper. 
>- [Input tab](https://apify.com/drobnikj/crawler-google-places/input-schema) with all the technical parameters of this scraper.
>- [Is web scraping legal?](https://blog.apify.com/is-web-scraping-legal/) - your extended reference to ethical scraping.
>- [Platform pricing page](https://apify.com/pricing/actors) with pricing specifications.  
>- [Video guide ▷](https://www.youtube.com/watch?v=s_89WpOsKRI) on how to choose the right subscription plan.
>- [CHANGELOG.md](https://github.com/drobnikj/crawler-google-places/blob/master/CHANGELOG.md) with a list of recent updates.


<a href="https://console.apify.com/actors/nwua9Gu5YrADL7ZDj" target="_blank">  
<img width="20%" src="https://imgur.com/FS6hnof.png"/> </a>
