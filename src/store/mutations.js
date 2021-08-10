const mutations = {
  SET_USER (state, payload) {
    state.user = payload.user
  },
  SET_CONVERSATIONS (state, payload) {
    state.conversations = payload.conversations
  },
  SET_SELECTED_CONVERSATION (state, payload) {
    state.selectedConversation = payload.conversation
  },
  SET_LIST_USERS (state, payload) {
    state.listUsers = payload.listUsers
  },
  SET_LOADING (state, payload) {
    state.isLoading = payload.isLoading
  },
  ADD_CONVERSATION (state, payload) {
    state.conversations.unshift(payload.conversation)
  },
  DELETE_CONVERSATION (state, payload) {
    const index = state.conversations.findIndex(item => item._id === payload.conversationId)

    if (index > -1) {
      state.conversations.splice(index, 1)
    }
  },
  UPDATE_CONVERSATION (state, payload) {
    const index = state.conversations.findIndex(item => item.fileName === payload.fileName)

    if (index > -1) {
      state.conversations[index].status.push({
        status: payload.status,
        created_at: payload.created_at
      })
    }
  },
  UPDATE_SEARCH_QUERY (state, payload) {
    state.searchQuery = payload.searchQuery
  },
  SET_SERVER_STORAGE (state, payload) {
    state.serverStorages = payload.serverStorages
  },
  SET_DOING_ASR (state, payload) {
    state.isDoingASR = payload.isDoingASR
  }
}

export default mutations
