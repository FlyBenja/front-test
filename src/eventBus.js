import { createApp } from 'vue'

const app = createApp({})
const eventBus = app.config.globalProperties.emitter = {}

eventBus.$on = function (event, callback) {
  if (!this[event]) {
    this[event] = []
  }
  this[event].push(callback)
}

eventBus.$off = function (event, callback) {
  if (!this[event]) {
    return
  }
  if (!callback) {
    this[event] = []
    return
  }
  this[event] = this[event].filter(cb => cb !== callback)
}

eventBus.$emit = function (event, ...args) {
  if (!this[event]) {
    return
  }
  this[event].forEach(callback => callback(...args))
}

export default eventBus