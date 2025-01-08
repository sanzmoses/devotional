export const BIBLE_API_BASE_URL = 'https://bible-api.com'

export const BIBLE_VERSIONS = {
  KJV: 'kjv', // World English Bible (default)
}

export const DEFAULT_VERSION = BIBLE_VERSIONS.KJV

// Helper function to format the reference for the URL
export function formatReference(book, verses) {
  return `${book} ${verses}`.replace(/\s+/g, '+')
}

// Helper function to create the full Bible API URL
export function createBibleApiUrl(book, verses, version = DEFAULT_VERSION) {
  const reference = formatReference(book, verses)
  return `${BIBLE_API_BASE_URL}/${reference}?translation=${version}`
}
