import { defineStore } from 'pinia'
import readingData from '../data/reading.json'

export const useReadingStore = defineStore('reading', {
  state: () => ({
    currentDate: new Date(),
    readings: readingData
  }),

  getters: {
    /**
     * Get the current month's readings data
     */
    currentMonthData: (state) => {
      const monthIndex = state.currentDate.getMonth()
      return state.readings[monthIndex] || state.readings[0] // Fallback to first month if current month not found
    },

    /**
     * Get the current day's readings
     */
    currentDayReadings: (state) => {
      const day = state.currentDate.getDate()
      const monthData = state.readings[state.currentDate.getMonth()] || state.readings[0]
      
      if (!monthData || !monthData.days) {
        console.error('Month data not found')
        return null
      }

      const dayData = monthData.days.find(d => d.day === day)
      if (!dayData || !dayData.readings || dayData.readings.length === 0) {
        return null
      }

      return dayData.readings
    },

    /**
     * Get the current month name
     */
    currentMonth: (state) => {
      const monthData = state.readings[state.currentDate.getMonth()] || state.readings[0]
      return monthData ? monthData.month : ''
    },

    /**
     * Get the current day number
     */
    currentDay: (state) => {
      return state.currentDate.getDate()
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
     * Move to the next reading day
     */
    nextDay() {
      const nextDate = new Date(this.currentDate)
      nextDate.setDate(nextDate.getDate() + 1)
      
      // Check if the next date has readings in our data
      const nextMonthData = this.readings[nextDate.getMonth()] || this.readings[0]
      if (nextMonthData && nextMonthData.days.some(d => d.day === nextDate.getDate())) {
        this.currentDate = nextDate
      }
    },

    /**
     * Move to the previous reading day
     */
    previousDay() {
      const prevDate = new Date(this.currentDate)
      prevDate.setDate(prevDate.getDate() - 1)
      
      // Check if the previous date has readings in our data
      const prevMonthData = this.readings[prevDate.getMonth()] || this.readings[0]
      if (prevMonthData && prevMonthData.days.some(d => d.day === prevDate.getDate())) {
        this.currentDate = prevDate
      }
    },

    /**
     * Set the date to today
     */
    setToday() {
      const today = new Date()
      
      // Check if today has readings in our data
      const monthData = this.readings[today.getMonth()] || this.readings[0]
      if (monthData && monthData.days.some(d => d.day === today.getDate())) {
        this.currentDate = today
      } else {
        // If today doesn't have readings, find the closest previous day that does
        const day = monthData.days.reduce((closest, curr) => {
          if (curr.day <= today.getDate() && curr.day > closest.day) {
            return curr
          }
          return closest
        }, { day: 0 })
        
        if (day.day > 0) {
          const validDate = new Date(today)
          validDate.setDate(day.day)
          this.currentDate = validDate
        }
      }
    }
  }
})