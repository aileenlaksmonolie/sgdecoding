import http from '@/helpers/http'
import router from '@/router'
import toast from 'toastr'

const actions = {
  async login ({ commit }, payload) {
    try {
      const response = await http.post('/auth/login', {
        email: payload.credentials.email,
        password: payload.credentials.password,
        rememberMe: payload.credentials.rememberMe
      })

      commit('SET_USER', { user: response.data.user })

      payload.vm.$root.initSockets()
      router.push('/')
    } catch (e) {
      // console.log(e)
      if (e.response.status === 400) {
        toast.error('Email and password must not be empty!', 'Error!')
      } else {
        toast.error('Email or password is incorrect!', 'Error!')
      }
    }
  },
  async logout ({ commit }, payload) {
    try {
      await http.get('/auth/logout')
      commit('SET_USER', { user: null })
    } catch (e) {
      // console.log(e)
    }
  },
  async getUser ({ commit }, payload) {
    try {
      const response = await http.get('/getUser')
      commit('SET_USER', { user: response.data.user })
    } catch (e) {
      // console.log(e)
    }
  },
  async getConversations ({ commit }, payload) {
    try {
      commit('SET_LOADING', { isLoading: true })
      const response = await http.get('/offline/conversations')
      commit('SET_CONVERSATIONS', { conversations: response.data.conversations })

      commit('SET_LOADING', { isLoading: false })
    } catch (e) {
      commit('SET_LOADING', { isLoading: false })
      // console.log(e)
      toast.error(e.response.data.message, 'Error!')
    }
  },
  async deleteConversation ({ commit }, payload) {
    try {
      await http.delete(`/offline/conversations/${payload.conversationId}`)
      commit('DELETE_CONVERSATION', { conversationId: payload.conversationId })
    } catch (e) {
      // console.log(e)
      toast.error(e.response.data.message, 'Error!')
    }
  },
  async loadServerStorages ({ commit }, payload) {
    try {
      const response = await http.get('/offline/loadServerStorages')
      commit('SET_SERVER_STORAGE', { serverStorages: response.data.storages })
    } catch (e) {
      // console.log(e)
      toast.error(e.response.data.message, 'Error!')
    }
  }
}

export default actions
