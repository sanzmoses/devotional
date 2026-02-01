import { defineStore } from 'pinia'
import plansConfig from '../data/plans.json'

export const useReadingStore = defineStore('reading', {
  state: () => ({
    currentDate: new Date(),
    currentPlan: plansConfig.plans.find(p => p.isDefault) || plansConfig.plans[0],
    availablePlans: plansConfig.plans,
    readings: {},
    loadedMonths: new Set()
  }),

  getters: {
    /**
     * Get the current month's readings data
     */
    currentMonthData: (state) => {
      const monthIndex = state.currentDate.getMonth()
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const monthName = monthNames[monthIndex]
      return state.readings[monthName] || null
    },

    /**
     * Get the current day's readings
     */
    currentDayReadings: (state) => {
      const day = state.currentDate.getDate()
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const monthName = monthNames[state.currentDate.getMonth()]
      const monthData = state.readings[monthName]
      
      if (!monthData || !monthData.days) {
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
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      return monthNames[state.currentDate.getMonth()]
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
     * Load a month's reading data
     */
    async loadMonth(monthName) {
      if (this.loadedMonths.has(monthName)) {
        return
      }

      try {
        const module = await import(`../data/${this.currentPlan.directory}/${monthName}.json`)
        this.readings[monthName] = module.default
        this.loadedMonths.add(monthName)
      } catch (error) {
        console.error(`Failed to load ${monthName} data:`, error)
      }
    },

    /**
     * Set the current reading plan
     */
    async setPlan(planId) {
      const plan = this.availablePlans.find(p => p.id === planId)
      if (plan) {
        this.currentPlan = plan
        this.readings = {}
        this.loadedMonths.clear()
        
        // Load current month data
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const currentMonth = monthNames[this.currentDate.getMonth()]
        await this.loadMonth(currentMonth)
      }
    },

    /**
     * Set the current date
     */
    async setDate(date) {
      const newDate = new Date(date)
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const newMonth = monthNames[newDate.getMonth()]
      
      // Load the month data if not already loaded
      await this.loadMonth(newMonth)
      
      this.currentDate = newDate
    },

    /**
     * Move to the next reading day
     */
    async nextDay() {
      const nextDate = new Date(this.currentDate)
      nextDate.setDate(nextDate.getDate() + 1)
      
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const nextMonth = monthNames[nextDate.getMonth()]
      
      // Load next month data if needed
      await this.loadMonth(nextMonth)
      
      const nextMonthData = this.readings[nextMonth]
      if (nextMonthData && nextMonthData.days.some(d => d.day === nextDate.getDate())) {
        this.currentDate = nextDate
      }
    },

    /**
     * Move to the previous reading day
     */
    async previousDay() {
      const prevDate = new Date(this.currentDate)
      prevDate.setDate(prevDate.getDate() - 1)
      
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const prevMonth = monthNames[prevDate.getMonth()]
      
      // Load previous month data if needed
      await this.loadMonth(prevMonth)
      
      const prevMonthData = this.readings[prevMonth]
      if (prevMonthData && prevMonthData.days.some(d => d.day === prevDate.getDate())) {
        this.currentDate = prevDate
      }
    },

    /**
     * Set the date to today
     */
    async setToday() {
      const today = new Date()
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const currentMonth = monthNames[today.getMonth()]
      
      // Load current month data
      await this.loadMonth(currentMonth)
      
      const monthData = this.readings[currentMonth]
      if (monthData && monthData.days.some(d => d.day === today.getDate())) {
        this.currentDate = today
      } else if (monthData) {
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
    },

    /**
     * Initialize the store with default plan and current month
     */
    async initialize() {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const currentMonth = monthNames[this.currentDate.getMonth()]
      await this.loadMonth(currentMonth)
    }
  }
})