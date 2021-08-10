import Vue from 'vue'
import moment from 'moment'

Vue.filter('toHHMMSS', secs => {
  const secNum = parseInt(secs, 10)
  const hours = Math.floor(secNum / 3600) % 24
  const minutes = Math.floor(secNum / 60) % 60
  const seconds = secNum % 60
  return [hours, minutes, seconds]
    .map(v => v < 10 ? '0' + v : v)
    .filter((v, i) => v !== '00' || i > 0)
    .join(':')
})

Vue.filter('normalIOSDate', date => {
  return moment(date).format('DD-MM-YYYY, HH:mm:ss')
})

Vue.filter('formatBytes', (a, b) => {
  if (a === 0) return '0 Bytes'
  const c = 1024
  const d = b || 2
  const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const f = Math.floor(Math.log(a) / Math.log(c))
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
})
