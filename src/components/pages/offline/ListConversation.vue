<template>
  <div
    class="list-conversations">
    <div
      v-if="!filteredConversation.length"
      class="alert alert-warning"
      role="alert">
      You don't have any conversation. Upload or record your own conversation
    </div>
    <div v-else>
      <transition-group name="slide-fade">
        <ConversationItem
          v-for="conversation in filteredConversation"
          :key="conversation._id"
          :conversation="conversation"
          @selectConversation="selectConversation"/>
      </transition-group>
    </div>
    <ModalConfirmDelete
      v-if="selectedConversation"
      :selected-conversation="selectedConversation"
      @deleteConversation="deleteConversation"/>
  </div>
</template>

<script>
import ConversationItem from './ConversationItem.vue'
import ModalConfirmDelete from './ModalConfirmDelete'
import { mapState } from 'vuex'

export default {
  components: {
    ConversationItem,
    ModalConfirmDelete
  },
  props: {
    listConversations: {
      type: Array,
      required: true
    }
  },
  computed: {
    filteredConversation () {
      return this.listConversations.filter(row => {
        return row.originalFileName.includes(this.searchQuery)
      })
    },
    ...mapState([
      'selectedConversation',
      'searchQuery'
    ])
  },
  mounted () {
    this.$bus.on('status', data => {
      this.$store.commit('UPDATE_CONVERSATION', data)
    })
  },
  methods: {
    selectConversation (conversation) {
      this.$store.commit('SET_SELECTED_CONVERSATION', { conversation })
    },
    async deleteConversation () {
      try {
        await this.$store.dispatch('deleteConversation', { conversationId: this.selectedConversation._id })
        // eslint-disable-next-line no-undef
        $('#confirmDeleteModal').modal('hide')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}

.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
