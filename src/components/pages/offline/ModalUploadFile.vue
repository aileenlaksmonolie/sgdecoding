<template>
  <div
    id="importFileModal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modalImportFile"
    aria-hidden="true">
    <div
      class="modal-dialog modal-dialog-centered modal-xl"
      role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h2
            id="modalImportFile"
            class="modal-title">Import Audio</h2>
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
                  <th scope="col">Name</th>
                  <th scope="col">Size</th>
                  <th scope="col">Storage</th>
                  <th scope="col">
                    Channel
                    <i
                      class="far fa-question-circle"
                      data-toggle="modal"
                      data-target="#modalQuestion" />
                  </th>
                  <th scope="col">Progress</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in listUploadFiles"
                  :key="index">
                  <th scope="row">
                    <div class="media align-items-center">
                      <div class="media-body file-name">
                        <span class="mb-0 text-sm">{{ item.file.name }}</span>
                      </div>
                    </div>
                  </th>
                  <td>
                    {{ item.file.size | formatBytes }}
                  </td>
                  <td>
                    <select
                      v-if="$store.state.serverStorages"
                      :class="{'is-invalid': item.hasError}"
                      v-model="item.storageName"
                      class="custom-select">
                      <option
                        v-for="(key, index) in Object.keys($store.state.serverStorages)"
                        :value="key"
                        :key="index">
                        {{ $store.state.serverStorages[key].name }}
                      </option>
                    </select>
                    <select
                      v-else
                      class="custom-select">
                      <option>
                        Choose...
                      </option>
                    </select>
                  </td>
                  <td>
                    <div class="custom-control custom-checkbox">
                      <input
                        id="customCheck2"
                        v-model="item.isMono"
                        class="custom-control-input"
                        type="checkbox"
                        checked>
                      <label
                        class="custom-control-label"
                        for="customCheck2">
                        Mono
                      </label>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <span class="mr-2">{{ item.progress }}%</span>
                      <div>
                        <div class="progress">
                          <div
                            :aria-valuenow="item.progress"
                            :style="'width:' + item.progress + '%;'"
                            class="progress-bar bg-primary"
                            role="progressbar"
                            aria-valuemin="0"
                            aria-valuemax="100"/>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      class="badge badge-dot mr-4">
                      <i
                        :class="{
                          'bg-default': item.status === 0,
                          'bg-primary': item.status === 1,
                          'bg-warning': item.status === 2,
                          'bg-success': item.status === 3,
                      }"/>
                      {{ item.status | formatStatusText }}
                    </span>
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
            data-dismiss="modal"
            @click="$emit('closeUploadFile')">Cancel</button>
          <button
            type="button"
            class="btn btn-primary"
            @click="$refs.file.click()" >
            Choose file
            <input
              id="upload-input"
              ref="file"
              type="file"
              multiple
              accept="audio/*"
              @change="$emit('onFileChanged', $event)">
          </button>
          <button
            type="button"
            class="btn btn-success"
            @click="$emit('uploadFile')" >
            Upload files
          </button>
        </div>
      </div>
    </div>
    <div
      id="modalQuestion"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modalQuestionLabel"
      aria-hidden="true">
      <div
        class="modal-dialog"
        role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h2
              id="modalQuestionLabel"
              class="modal-title">Audio channel</h2>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            By default, audio uploaded to server will be considered as mono channel. If you want your audio to be processed as muti-channel audio, un-check the checkbox below
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    formatStatusText (value) {
      if (value === 0) {
        return 'Waiting for upload'
      } else if (value === 1) {
        return 'Uploading'
      } else if (value === 2) {
        return 'Preprocessing'
      } else {
        return 'Success'
      }
    }
  },
  props: {
    listUploadFiles: {
      type: Array,
      required: true
    }
  },
  mounted () {
    this.$bus.on('finishUploading', () => {
      // eslint-disable-next-line
      $('#importFileModal').modal('hide')
    })
  }
}
</script>

<style lang="scss" scoped>
#upload-input {
  display: none;
}
.file-name {
  white-space: nowrap;
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
