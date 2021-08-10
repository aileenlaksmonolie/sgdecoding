<template>
  <div
    id="modalDownloadFile"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modalDownloadFileLabel"
    aria-hidden="true">
    <div
      class="modal-dialog modal-dialog-centered modal-lg"
      role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h2
            id="modalDownloadFileLabel"
            class="modal-title">Download files</h2>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="table-responsive">
            <table class="table align-items-center">
              <thead class="thead-light">
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col">Filename</th>
                  <th scope="col">Type</th>
                  <th scope="col">Size</th>
                  <th scope="col"/>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(file, index) in conversation.files"
                  :key="file.filename">
                  <td>
                    {{ index + 1 }}
                  </td>
                  <th
                    scope="row"
                    class="file-name">
                    {{ file.filename }}
                  </th>
                  <td>
                    {{ file.type }}
                  </td>
                  <td>
                    {{ file.size | formatBytes }}
                  </td>
                  <td>
                    <button
                      class="btn btn-primary"
                      @click="downloadFile(`${urlToUserFolder}/${file.filename}`, file.filename)">
                      <i class="fas fa-download"/>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal">Close</button>
          <button
            type="button"
            class="btn btn-primary"
            @click="downloadAllFiles">Download all files</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    conversation: {
      type: Object,
      required: true
    }
  },
  computed: {
    fileNameWithoutExtension () {
      return this.conversation.fileName.split('.')[0]
    },
    urlToUserFolder () {
      return `${this.$store.state.baseUrl}/audios/outputs/export/data/output/${this.fileNameWithoutExtension}`
    }
  },
  methods: {
    async downloadFile (path, file) {
      try {
        const response = await axios({
          url: path,
          method: 'GET',
          responseType: 'blob' // important
        })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', file)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (err) {
        console.log(err)
      }
    },
    async downloadAllFiles () {
      try {
        const url = `${this.$store.state.baseUrl}/audios/outputs/${this.fileNameWithoutExtension}.zip`
        await this.downloadFile(url, `${this.fileNameWithoutExtension}.zip`)
        // eslint-disable-next-line
        $('#modalDownloadFile').modal('hide')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .file-name {
    white-space: nowrap;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
