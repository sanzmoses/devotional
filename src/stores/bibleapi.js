import { defineStore } from 'pinia'
import { 
  BIBLE_VERSIONS, 
  DEFAULT_VERSION,
  createBibleApiUrl 
} from '../data/bible-api-ref.js'

export const useBibleApiStore = defineStore('bibleapi', {
  state: () => ({
    version: DEFAULT_VERSION,
    verseCache: new Map(), // Cache verses to avoid repeated API calls
    loading: false,
    error: null
  }),

  getters: {
    /**
     * Get the current Bible version
     */
    currentVersion: (state) => state.version,

    /**
     * Get all available Bible versions
     */
    availableVersions: () => Object.values(BIBLE_VERSIONS),

    /**
     * Check if verses are being loaded
     */
    isLoading: (state) => state.loading,

    /**
     * Get any error message
     */
    getError: (state) => state.error,

    /**
     * Get cached verse data
     */
    getCachedVerse: (state) => (book, verses) => {
      const cacheKey = `${book}-${verses}-${state.version}`
      return state.verseCache.get(cacheKey)
    }
  },

  actions: {
    /**
     * Set the Bible version
     */
    setVersion(version) {
      if (Object.values(BIBLE_VERSIONS).includes(version)) {
        this.version = version
        // Clear cache when version changes
        this.verseCache.clear()
      }
    },

    /**
     * Reset to default version
     */
    resetVersion() {
      this.version = DEFAULT_VERSION
      this.verseCache.clear()
    },

    /**
     * Get verses for a reading
     */
    async getVerses(reading) {
      if (!reading || !reading.book || !reading.verses) {
        return null
      }

      const cacheKey = `${reading.book}-${reading.verses}-${this.version}`
      
      // Check cache first
      if (this.verseCache.has(cacheKey)) {
        return this.verseCache.get(cacheKey)
      }

      this.loading = true
      this.error = null

      try {
        const response = await fetch(createBibleApiUrl(reading.book, reading.verses, this.version))
        if (!response.ok) {
          throw new Error('Failed to fetch verses')
        }
        
        const data = await response.json()
        
        // Cache the result
        this.verseCache.set(cacheKey, data)
        
        return data
      } catch (error) {
        console.error('Error fetching verses:', error)
        this.error = error.message
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * Get verses for multiple readings
     */
    async getMultipleVerses(readings) {
      if (!readings || !Array.isArray(readings)) {
        return []
      }

      const promises = readings.map(reading => this.getVerses(reading))
      const results = await Promise.all(promises)

      return readings.map((reading, index) => ({
        ...reading,
        verses: results[index]?.text || '',
        reference: results[index]?.reference || ''
      }))
    },

    /**
     * Clear the verse cache
     */
    clearCache() {
      this.verseCache.clear()
    }
  }
})