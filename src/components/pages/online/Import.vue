<template>
  <div class="row stream-import">
    <div class="col-md-12">
      <div class="custom-file">
        <input
          id="customFile"
          accept="audio/mp3,audio/wav"
          type="file"
          class="custom-file-input"
          @change="onFileChange($event)">
        <label
          id="custom-file-label-element"
          class="custom-file-label"
          for="customFile">
          {{ uploadedFile.name ? uploadedFile.name : 'Choose file' }}

        </label>
        <button
          id="btn-start-streaming"
          class="btn btn-primary"
          @click="startStreaming">
          START
        </button>
      </div>
    </div>
    <div class="col-md-12 mt-5">
      <div
        class="form-group transcription">
        <span
          v-if="status === 2"
          class="is-finish">
          <i class="fal fa-check"/>
        </span>
        <textarea
          v-model="data"
          :class="status === 2 ? 'is-valid' : 'form-control-alternative'"
          :disabled="status === 1 ? false : true"
          class="form-control"
          rows="8"
          cols="80"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      uploadedFile: {},
      data: '',
      status: 0 // 0: init state, 1: ASR in progress, 2: finish ASR
    }
  },
  mounted () {
    this.$bus.on('stream-import', data => {
      if (data.status === 0) { // if receive END signal from backend
        this.status = 2
        this.$store.commit('SET_DOING_ASR', { isDoingASR: false })
      } else {
        this.data = data.message
      }
    })
  },
  beforeDestroy () {
    if (this.status === 1) {
      this.$root.socket.emit('stream-import-cancel')
      this.$store.commit('SET_DOING_ASR', { isDoingASR: false })
    }
  },
  methods: {
    onFileChange (event) {
      this.uploadedFile = event.target.files[0]
    },
    async startStreaming () {
      try {
        if (this.status === 1) {
          return
        }

        this.$store.commit('SET_DOING_ASR', { isDoingASR: true })
        this.status = 1
        this.data = ''
        const formData = new FormData()
        formData.append('file', this.uploadedFile)
        formData.append('online', true)

        await this.$http.post('/online/import/stream', formData)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-file {
  display: flex;
  #custom-file-label-element {
    &::after {
      right: 90px;
    }
  }
}
#btn-start-streaming {
  z-index: 1;
  border-radius: 0;
  border-top-right-radius: .375rem;
  border-bottom-right-radius: .375rem;
}

.stream-import {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.transcription {
  position: relative;
  .is-finish {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #69deac;
    border-radius: 50%;
    height: 25px;
    width: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  textarea {
    font-size: 18px;
  }
}

</style>
