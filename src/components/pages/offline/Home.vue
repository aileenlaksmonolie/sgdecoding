<template>
  <!-- Page content -->
  <div>
    <div class="container-fluid mt--7">
      <!-- Table -->
      <div class="row">
        <div class="col">
          <div class="card shadow">
            <div class="card-body">
              <div class="row home-content">
                <div class="col-lg-9">
                  <div v-if="$store.state.isLoading">
                    <Loading/>
                  </div>
                  <div v-else>
                    <ListConversation
                      :list-conversations="$store.state.conversations"
                    />
                  </div>
                </div>
                <div class="col-lg-3">
                  <div class="btn-recording">
                    <router-link
                      to="/recording"
                      class="btn btn-primary"
                      style="width: 100%;">
                      Start recording
                    </router-link>
                  </div>
                  <div class="btn-import mt-3">
                    <button
                      class="btn btn-secondary"
                      style="width: 100%;"
                      @click="showUploadForm">
                      Import audio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModalUploadFile
      :list-upload-files="listUploadFiles"
      @onFileChanged="onFileChanged"
      @closeUploadFile="closeUploadFile"
      @uploadFile="uploadFile"/>
  </div>
</template>

<script>
import ModalUploadFile from './ModalUploadFile'
import ListConversation from './ListConversation'

export default {
  components: {
    ModalUploadFile,
    ListConversation
  },
  data () {
    return {
      listUploadFiles: []
    }
  },
  async created () {
    if (!this.$store.state.conversations) {
      await this.$store.dispatch('getConversations')
    }
  },
  methods: {
    onFileChanged (event) {
      this.listUploadFiles = [...this.listUploadFiles, ...event.target.files]
      this.listUploadFiles = this.listUploadFiles.map(item => {
        if (item.progress === 100) {
          return item
        }
        return {
          file: item.file ? item.file : item,
          progress: 0,
          storageName: 'english',
          hasError: false,
          status: 0,
          isMono: true
        }
      })
    },
    showUploadForm () {
      // eslint-disable-next-line
      $('#importFileModal').modal('show')
      if (!this.$store.state.serverStorages) {
        this.$store.dispatch('loadServerStorages')
      }
    },
    closeUploadFile () {
      this.listUploadFiles = []
    },
    async uploadFile () {
      if (!this.listUploadFiles.length) {
        return
      }
      try {
        for (const item of this.listUploadFiles) { // don't use foreach because it won't wait for async await
          if (!item.storageName.trim().length) {
            item.hasError = true
            return
          } else {
            item.hasError = false
          }
          if (item.status === 0) {
            item.status = 1 // start uploading

            const formData = new FormData()
            formData.append('file', item.file)
            formData.append('storageName', item.storageName)

            if (!item.isMono) {
              formData.append('channel', 'multi')
            }

            const response = await this.$http.post('/offline/fileUpload', formData, {
              onUploadProgress: (progressEvent) => {
                item.progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                if (item.progress === 100) {
                  item.status = 2 // finish uploading (wait to scp to server)
                }
              }
            })
            if (response.data.message === 'success') {
              this.$store.commit('ADD_CONVERSATION', { conversation: response.data.conversation })
              item.status = 3 // successfully scp to server
            }
          }
        }
        this.$bus.emit('finishUploading')
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 992px) {
  .home-content {
    flex-direction: column-reverse;
    &>div:nth-child(2) {
      margin-bottom: 2rem;
    }
  }
}
</style>
