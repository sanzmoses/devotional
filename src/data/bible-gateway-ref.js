// Bible Gateway API Documentation
// All requests use the base url of:

// https://api.biblegateway.com/2/
// Authorization
// Requests now require authorization. You must get an access_token, and pass the access_token parameter on each request in the query string. Use the following construction for your access token request:

// /request_access_token?username=[user]&password=[password]
// Returns the access_token and the expiration. The expiration is the unix time (number of seconds since epoch). If it expires, or you're not authorized for a translation, you'll get an object that looks like:

// {"error":{"errcode":4,"errmsg":"Invalid access_token"}}
// After receiving the access_token, pass it along with your request like this example:

// /bible/niv?access_token=token
// Methods
// The requests are:

// /bible
// Returns a list of bible abbreviations for which you are authorized. These abbreviations can be used in the 'translation-list' in other api methods.

// /bible/translation-list
// where translation-list is a list of bible abbreviations separated by commas. Example - /bible/niv, /bible/niv,esv

// This returns an array of attribution and data objects, one for each translation in the list. The attribution object contains publisher information, and the data object contains information about the books of the translation. Look in the object to see what is returned. The order of the array is the same as translation-list that was passed in.

// /bible/osis/translation-list
// where osis is a bible reference, like 'Matt 5', 'Matt 5:1-3', and translation-list is as above.

// An osis value is quite flexible. To get a single verse, use 'Matt 1:1'. A range is 'Matt 1:1-5". A full chapter is "Matt 1". It returns an array of data objects. The order of the array is the same as the translation-list passed in. Each json object contains:

// { title: {title-object}, content: 'html-content' }
// If you pass in 'resources' in the object query string parameter, then you'll get the table of contents for the extrabiblical content associated with the osis. This object will only be passed back for the first translations, if there is more than one translation in the translation list.

// /bible/search/terms/translation-list
// Keyword search. Terms are the search terms. Returns a data and query object. The data is an array of hits. You can also pass in the following query parameters:

// search_type -> 'all' (default), 'phrase', or 'any'
// start -> the starting index. Defaults to 0.
// limit -> maximum number of returned hits. Defaults to 100.
// book_start -> beginning book number to limit search
// book_end -> ending book number to limit search
// You can add an objects parameter to the query string to get more objects with the returned data. For example, if you add ?objects=data,attribution to the /bible/osis call, you'll get the data object plus the attribution object for the translations.

// If you add ?objects=data,attribution to the /bible/translation-list call, you'll get the attribution object, plus the data object which contains the translation information (currently empty).

// Each call has a default object returned. For the /bible/osis call, it's a data object. For the /bible/translation-list call, it's an attribution object. For /bible/search you get a data and query object.

// /resources/contents/osis
// Gets the table of contents for the extrabiblical resources associated with the osis. The format is an array of objects. Each object contains the publication information, such as the title and permalink, and an array of 'chunks', which contains the titles and permalinks of the data for each entry in the contents.

// /resources/chunk/permalink
// Gets the chunk data (as html) for a resource chunk. The permalinks are returned in the /resources/contents call. Some publication information is also returned for convenience.

// /resources/publication/permalink
// Gets the detailed information for an extrabiblical publication. The permalink is returned in /resources/contents.

// /resources/publications/type
// Return basic publication information for commentaries or dictionaries. 'type' is either 'commentaries' or 'dictionaries'.

// /resources/pub-content/pub-permalink/chunk-permalink
// Returns the text and table of contents for a chunk. To get the first level table of contents, use 'toc' for the chunk-permalink. You can get the pub-permalink from the /resources/publications/type call.

export const BIBLE_GATEWAY_BASE_URL = 'https://www.biblegateway.com/passage/'
export const BIBLE_VERSIONS = {
  NIV: 'NIV',
  ESV: 'ESV',
  NKJV: 'NKJV',
  KJV: 'KJV',
  NLT: 'NLT'
}

export const DEFAULT_VERSION = BIBLE_VERSIONS.ESV

// Helper function to format the reference for the URL
export function formatReference(book, verses) {
  return `${book} ${verses}`.replace(/\s+/g, '+')
}

// Helper function to create the full Bible Gateway URL
export function createBibleGatewayUrl(book, verses, version = DEFAULT_VERSION) {
  const reference = formatReference(book, verses)
  return `${BIBLE_GATEWAY_BASE_URL}?search=${reference}&version=${version}`
}