import { defineStore } from 'pinia'
import readingData from '../data/reading.json'

export const useReadingStore = defineStore('reading', {
  state: () => ({
    currentDate: new Date(),
    readings: readingData
  }),

  getters: {
    /**
     * Get the current day's readings
     */
    currentDayReadings: (state) => {
      const date = state.currentDate
      return getDailyReadings(date)
    },

    /**
     * Check if the current day is Sunday
     */
    isSunday: (state) => {
      return state.currentDate.getDay() === 0
    }
  },

  actions: {
    /**
     * Set the current date
     */
    setDate(date) {
      this.currentDate = new Date(date)
    },

    /**
     * Move to the next reading day (skips Sundays)
     */
    nextDay() {
      const nextDate = new Date(this.currentDate)
      nextDate.setDate(nextDate.getDate() + 1)
      
      // Skip Sunday
      if (nextDate.getDay() === 0) {
        nextDate.setDate(nextDate.getDate() + 1)
      }
      
      this.currentDate = nextDate
    },

    /**
     * Move to the previous reading day (skips Sundays)
     */
    previousDay() {
      const prevDate = new Date(this.currentDate)
      prevDate.setDate(prevDate.getDate() - 1)
      
      // Skip Sunday
      if (prevDate.getDay() === 0) {
        prevDate.setDate(prevDate.getDate() - 1)
      }
      
      this.currentDate = prevDate
    },

    /**
     * Set the date to today (if today is Sunday, move to Monday)
     */
    setToday() {
      const today = new Date()
      
      // If today is Sunday, move to Monday
      if (today.getDay() === 0) {
        today.setDate(today.getDate() + 1)
      }
      
      this.currentDate = today
    }
  }
})

/**
 * Helper function to get the daily readings based on a date
 */
function getDailyReadings(date) {
  const dayOfWeek = date.getDay()
  const day = date.getDate()
  
  // Return null for Sundays
  if (dayOfWeek === 0) {
    return null
  }

  // Find the reading for the current day
  const reading = readingData.days.find(d => d.day === day)
  if (!reading) {
    console.error('Reading not found for date:', date)
    return null
  }

  return reading.readings
}