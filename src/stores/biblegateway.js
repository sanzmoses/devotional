import { defineStore } from 'pinia'
import { 
  BIBLE_VERSIONS, 
  DEFAULT_VERSION,
  createBibleGatewayUrl 
} from '../data/bible-gateway-ref.js'

export const useBibleGatewayStore = defineStore('biblegateway', {
  state: () => ({
    version: DEFAULT_VERSION
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
     * Generate Bible Gateway URL for a reading
     */
    getReadingUrl: (state) => (reading) => {
      if (!reading || !reading.book || !reading.verses) return null
      return createBibleGatewayUrl(reading.book, reading.verses, state.version)
    },

    /**
     * Generate Bible Gateway URLs for all readings
     */
    getReadingUrls: (state) => (readings) => {
      if (!readings) return []
      return readings.map(reading => ({
        ...reading,
        url: state.getReadingUrl(reading)
      }))
    }
  },

  actions: {
    /**
     * Set the Bible version
     */
    setVersion(version) {
      if (Object.values(BIBLE_VERSIONS).includes(version)) {
        this.version = version
      }
    },

    /**
     * Reset to default version
     */
    resetVersion() {
      this.version = DEFAULT_VERSION
    }
  }
})
