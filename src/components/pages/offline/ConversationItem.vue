<template>
  <div class="conversation-item">
    <div class="conversation-item-container">
      <div class="conversation-item-img">
        <div class="conversation-item-icon">
          <i class="far fa-file"/>
        </div>
      </div>
      <div
        class="conversation-item-content"
        @click="selectConversation">
        <div class="conversation-date-meta">
          {{ conversation.created_at | normalIOSDate }}
        </div>
        <div class="conversation-title">
          {{ conversation.name }}
        </div>
        <div class="conversation-meta">
          <div class="meta-item conversation-duration">
            <i class="far fa-clock"/>
            <span>{{ conversation.duration | toHHMMSS }}</span>
          </div>
          <div class="meta-item conversation-language ml-3">
            <i class="fas fa-language"/>
            <span>{{ conversation.storageName }}</span>
          </div>
          <div class="meta-item conversation-status ml-3">
            <div v-if="['created', 'done'].includes(conversation.status[conversation.status.length - 1].status.toLowerCase())">
              <i class="fas fa-circle icon-success text-success"/>
              {{ conversation.status[conversation.status.length - 1].status }}
            </div>
            <div v-else>
              <i
                class="fa fa-spinner fa-spin"/>
              {{ conversation.status[conversation.status.length - 1].status }}
            </div>
          </div>
          <div class="meta-item conversation-filename ml-3">
            <i class="fa fa-music"/>
            <span>{{ conversation.originalFileName }}</span>
          </div>
        </div>
      </div>
      <div class="conversation-item-actions">
        <div
          class="conversation-item-actions-container"
          data-toggle="modal"
          data-target="#confirmDeleteModal"
          @click="$emit('selectConversation', conversation)">
          <span>
            <i class="fas fa-trash" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    conversation: {
      type: Object,
      required: true
    }
  },
  methods: {
    selectConversation () {
      this.$router.push(`/conversation/${this.conversation._id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.conversation-item {
  .conversation-item-container {
    display: flex;
    padding: 15px 0;
    border-radius: 4px;
    cursor: pointer;
    .conversation-item-img {
      flex: 0 0 4.5rem;
      .conversation-item-icon {
        color: #8294a5;
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        background: #f4f5f7;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .conversation-item-content {
      flex: 1 1 auto;
      .conversation-date-meta, .conversation-meta {
        color: #8294a5;
        font-weight: 300;
        font-size: 14px;
      }
      .conversation-meta {
        display: flex;
        align-items: center;
        .meta-item {
          word-break: break-all;
        }
      }
      &:hover {
        .conversation-title {
          text-decoration: underline;
        }
      }
    }
    .conversation-item-actions {
      flex: 0 0 auto;
      align-self: center;
      .conversation-item-actions-container {
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 50%;
        transition: background .15s;
        &:hover {
          background: rgba(0,122,255,.1);
        }
        span {
          i {
            color: #8294a5;
          }
        }
      }
    }
  }
}
.conversation-item:not(:first-child) {
  border-top: solid 1px rgba(221, 221, 221, 0.5);
}

@media (max-width: 510px) {
  .conversation-item .conversation-item-container .conversation-item-img {
    flex: 0 0 4rem;
  }
  .conversation-meta {
    flex-direction: column;
    margin-top: 15px;
    .meta-item {
      width: 100%;
      margin-left: 0 !important;
    }
    .meta-item:not(:first-child) {
      margin-top: 10px;
    }
  }
}
</style>
