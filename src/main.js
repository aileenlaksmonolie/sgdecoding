import Vue from 'vue'
import App from './App'
import router from './router'
// import MainLayout from './components/layouts'
import http from '@/helpers/http'
import swal from 'sweetalert'
import io from 'socket.io-client'
import Bus from '@/helpers/bus'
import '../static/assets/scss/argon.scss'
import store from './store'
import '@/filters'
import toast from 'toastr'
import 'toastr/toastr.scss'
toast.options.progressBar = true

Vue.use(Bus)
// Vue.use(MainLayout)
Vue.config.productionTip = false
Vue.component('Loading', require('./components/partials/Loading').default)

Vue.prototype.$http = http
Vue.prototype.$swal = swal
Vue.prototype.$toast = toast

http.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.response.status === 401) { // Unauthorized
    if (router.currentRoute.name !== 'Login') {
      window.location.href = '/login'
    }
  } else if (error.response.status === 404) { // Unauthorized
    swal({
      title: 'Not Found!',
      text: 'This record isn\'t exist!',
      icon: 'warning',
      buttons: {
        catch: {
          text: 'OK'
        }
      },
      dangerMode: true
    })
      .then((willChange) => {
        window.location.href = '/'
      })
  } else if (error.response.status === 601) {
    swal({
      title: 'Unauthorized!',
      text: 'You don\'t have permission to perform this action',
      icon: 'warning',
      buttons: {
        catch: {
          text: 'OK'
        }
      },
      dangerMode: true
    })
      .then((willChange) => {
        window.location.href = '/'
      })
  } else if (error.response.status === 429) {
    swal({
      title: 'Too many requests!',
      text: 'You\'re making too many requests, wait for few minutes and try again!',
      icon: 'error',
      buttons: {
        catch: {
          text: 'OK'
        }
      },
      dangerMode: true
    })
      .then((willChange) => {
        window.location.href = '/login'
      })
  } else if (error.response.status === 605) { // when logout or session expired
    window.location.href = '/login'
  }
  return Promise.reject(error)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  data: {
    socket: null
  },
  methods: {
    initSockets () {
      this.socket = io(this.$store.state.baseUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity
      })

      this.socket.on('connect', () => {
        // if user is admin, user will join one more additional channel (so the user can receive status from all conversations of all user)
        // socketio will automatically detect if one user listen 1 channel for more than one time and prevent the duplication of event received by admin
        if (this.$store.state.user.role === 'admin') {
          this.socket.emit('join room', {room: this.$store.state.user.role})
        }

        this.socket.emit('join room', {room: this.$store.state.user._id})
      })

      this.socket.on('status', data => {
        this.$bus.emit('status', data)
      })

      this.socket.on('stream-import', data => {
        this.$bus.emit('stream-import', data)
      })

      this.socket.on('stream-record-ready', () => {
        this.$bus.emit('stream-record-ready')
      })

      this.socket.on('stream-record-data', data => {
        this.$bus.emit('stream-record-data', data)
      })

      this.socket.on('stream-record-close', () => {
        this.$bus.emit('stream-record-close')
      })
    }
  },
  template: '<App/>'
})
