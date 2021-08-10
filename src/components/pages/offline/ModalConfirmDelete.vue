<template>
  <div
    id="confirmDeleteModal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="confirmDeleteModalLabel"
    aria-hidden="true">
    <div
      class="modal-dialog modal-dialog-centered modal-lg"
      role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h2
            id="confirmDeleteModalLabel"
            class="modal-title">Warning</h2>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Are you sure want to delete conversation: <b>{{ selectedConversation.name }} ({{ selectedConversation.originalFileName }})</b> ? Data will permanently be deleted
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal">Cancel</button>
          <button
            type="button"
            class="btn btn-primary"
            @click="$emit('deleteConversation')">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedConversation: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>
