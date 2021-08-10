import env from '@/env'
const state = {
  user: null,
  conversations: null,
  selectedConversation: null,
  listUsers: null,
  isLoading: false,
  searchQuery: '',
  serverStorages: null,
  baseUrl: env.baseURL,
  isDoingASR: false
}

export default state
