<template>
  <div>
    <div class="container-fluid mt--7">
      <!-- Table -->
      <div class="row">
        <div class="col">
          <div class="card shadow">
            <div class="card-header">
              <div class="conversation-name">
                <div
                  v-if="file.isEdit"
                  class="form-group">
                  <input
                    v-model="conversationName"
                    :style="isConversationNameValid ? '' : 'border: solid 1px #fb6340;'"
                    type="text"
                    class="form-control form-control-alternative"
                    placeholder="Conversation name..."
                    @keyup.enter="changeConversationName"
                    @blur="changeConversationName">
                </div>
                <div v-else>
                  <span class="name">{{ file.name }}</span>
                  <span class="ml-3 edit-icon"><i
                    class="far fa-edit"
                    @click="file.isEdit = true"/></span>
                </div>
              </div>
              <div class="conversation-meta">
                <div class="conversation-date">
                  <i class="far fa-calendar-alt"/>
                  <span>Today</span>
                </div>
                <div class="conversation-time ml-3">
                  <i class="far fa-clock"/>
                  <span>{{ file.duration | toHHMMSS }}</span>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="row">
                <div
                  v-if="error.length > 0"
                  class="col-md-12">
                  <div
                    class="alert alert-danger"
                    role="alert">
                    The following error occured: <b>{{ error }}</b>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="recording">
                    <div class="recording-container">
                      <div class="visualizer-container">
                        <canvas class="visualizer"/>
                      </div>
                      <div class="recording-timer">
                        {{ file.duration | toHHMMSS }}
                      </div>
                      <div
                        v-if="recordingState === 'stopped'"
                        class="audio-preview">
                        <audio
                          id="audio-recorder"
                          controls>
                          <source
                            src=""
                            type="audio/wav">
                          Your browser does not support the audio element.
                        </audio>
                        <transition name="fade">
                          <div
                            v-if="file.isUploading"
                            class="row"
                            style="justify-content: center;">
                            <div class="col-md-6 mt-2">
                              <div class="progress-info">
                                <div class="progress-label">
                                  <span>Uploading...</span>
                                </div>
                                <div class="progress-percentage">
                                  <span>{{ file.progress }}%</span>
                                </div>
                              </div>
                              <div class="progress">
                                <div
                                  :aria-valuenow="file.progress"
                                  :style="'width:' + file.progress + '%;'"
                                  class="progress-bar bg-primary"
                                  role="progressbar"
                                  aria-valuemin="0"
                                  aria-valuemax="100"/>
                              </div>
                            </div>
                          </div>
                        </transition>
                      </div>
                      <div class="recording-actions mt-4">
                        <div class="btn-record">
                          <button
                            :disabled="error.length > 0"
                            class="btn btn-primary"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Start recording"
                            @click="toggleRecording">
                            <i
                              v-if="recordingState === 'recording'"
                              class="fa fa-pause btn-animated-blink"/>
                            <i
                              v-else
                              class="fa fa-microphone"/>
                          </button>
                        </div>
                        <div class="btn-stop ml-3">
                          <button
                            :disabled="error.length > 0"
                            class="btn btn-danger"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Stop recording"
                            @click="stopRecording">
                            <i class="fa fa-stop"/>
                          </button>
                        </div>
                        <div class="btn-stop ml-3">
                          <button
                            :disabled="recordingState !== 'stopped'"
                            class="btn btn-success"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Upload file"
                            @click="showUploadForm">
                            <i class="fa fa-upload"/>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal Renew Recording -->
    <div
      id="modalConfirm"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modalConfirmLabel"
      aria-hidden="true">
      <div
        class="modal-dialog modal-dialog-centered"
        role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h2
              id="modalConfirmLabel"
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
            Are you sure want to create new record? The current one will be deleted permantly!
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal">Close</button>
            <button
              type="button"
              class="btn btn-primary"
              @click="renewRecording">Confirm</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal Choose Server Storage -->
    <div
      id="modalServerStorage"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modalServerStorageLabel"
      aria-hidden="true">
      <div
        class="modal-dialog modal-dialog-centered"
        role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h2
              id="modalServerStorageLabel"
              class="modal-title">Choose Server Storage</h2>
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
                    <th scope="col">Server name</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody v-if="$store.state.serverStorages">
                  <tr
                    v-for="(key, index) in Object.keys($store.state.serverStorages)"
                    :key="index">
                    <th scope="row">
                      <div class="media align-items-center">
                        <div class="media-body file-name">
                          <span class="mb-0 text-sm">{{ $store.state.serverStorages[key].name }}</span>
                        </div>
                      </div>
                    </th>
                    <td>
                      <button
                        class="btn btn-primary btn-sm"
                        @click="uploadFile(key)">Upload</button>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Recorder from '@/helpers/recorder'

export default {
  data () {
    return {
      canvas: {},
      canvasCtx: {},
      drawVisual: {},
      audioCtx: {},
      analyser: {},
      dataArray: [],
      bufferLength: 0,
      recordingState: 'idle',
      mediaStream: {},
      file: {
        name: 'Note',
        created_date: Date.now(),
        duration: 0,
        data: {},
        progress: 0,
        isUploading: false,
        serverToUpload: 'english',
        isEdit: false,
        filename: 'recording.wav'
      },
      conversationName: 'Note',
      isConversationNameValid: true,
      recordingInterval: 0,
      recorder: {},
      error: ''
    }
  },
  async mounted () {
    this.canvas = document.querySelector('.visualizer')
    this.canvasCtx = this.canvas.getContext('2d')
    const intendedWidth = document.querySelector('.visualizer-container').clientWidth
    this.canvas.setAttribute('width', intendedWidth)
    this.canvas.setAttribute('height', 200)

    this.canvas.style.width = (intendedWidth / 2) + 'px'
    this.canvas.style.height = '100px'

    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    let source

    this.analyser = this.audioCtx.createAnalyser()
    this.analyser.minDecibels = -90
    this.analyser.maxDecibels = -10
    this.analyser.smoothingTimeConstant = 0.85

    const distortion = this.audioCtx.createWaveShaper()
    const gainNode = this.audioCtx.createGain()
    const biquadFilter = this.audioCtx.createBiquadFilter()
    const convolver = this.audioCtx.createConvolver()

    if (!navigator.mediaDevices) {
      this.error = 'Your browser doesn\'t support audio recorder. Make sure you grant permission for recording audio and your browser is running with HTTPS'
    }

    if (navigator.mediaDevices.getUserMedia) {
      try {
        console.log('getUserMedia supported.')
        const constraints = {audio: true}
        this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

        source = this.audioCtx.createMediaStreamSource(this.mediaStream)
        source.connect(distortion)
        distortion.connect(biquadFilter)
        biquadFilter.connect(gainNode)
        convolver.connect(gainNode)
        gainNode.connect(this.analyser)
        this.analyser.connect(this.audioCtx.destination)
        this.audioCtx.resume()
        this.visualize()

        this.recorder = new Recorder(source)
      } catch (err) {
        console.log('The following error occured: ' + err)
        this.error = err.toString()
      }
    } else {
      this.error = 'getUserMedia not supported on your browser!'
      console.log('getUserMedia not supported on your browser!')
    }
  },
  beforeDestroy () {
    window.cancelAnimationFrame(this.drawVisual)
    const track = this.mediaStream.getTracks()[0] // if only one media track
    track.stop()
  },
  methods: {
    visualize () {
      this.analyser.fftSize = 2048
      this.bufferLength = this.analyser.fftSize
      this.dataArray = new Uint8Array(this.bufferLength)

      this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      this.draw()
    },
    draw () {
      this.drawVisual = requestAnimationFrame(this.draw)

      this.analyser.getByteTimeDomainData(this.dataArray)

      this.canvasCtx.fillStyle = 'white'
      this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height)

      this.canvasCtx.lineWidth = 2
      this.canvasCtx.strokeStyle = '#007aff'

      this.canvasCtx.beginPath()

      const sliceWidth = this.canvas.width * 1.0 / this.bufferLength
      let x = 0

      for (let i = 0; i < this.bufferLength; i++) {
        const v = this.dataArray[i] / 128.0
        const y = v * this.canvas.height / 2

        if (i === 0) {
          this.canvasCtx.moveTo(x, y)
        } else {
          this.canvasCtx.lineTo(x, y)
        }

        x += sliceWidth
      }

      this.canvasCtx.lineTo(this.canvas.width, this.canvas.height / 2)
      this.canvasCtx.stroke()
    },
    toggleRecording () {
      if (this.error.length > 0) {
        return
      }

      if (this.recordingState === 'stopped') {
        // eslint-disable-next-line
        $('#modalConfirm').modal('show')
      } else if (this.recordingState === 'recording') {
        this.recordingState = 'pause'
        window.cancelAnimationFrame(this.drawVisual)
        this.recorder.stop()
      } else if (this.recordingState === 'idle' || this.recordingState === 'pause') {
        this.recordingState = 'recording'
        this.visualize()
        this.recorder.record()
        if (!this.recordingInterval) {
          this.recordingInterval = setInterval(() => {
            if (this.recordingState !== 'pause') {
              this.file.duration++
            }
          }, 1000)
        }
      }
    },
    renewRecording () {
      // eslint-disable-next-line
      $('#modalConfirm').modal('hide')
      this.recorder.clear()
      this.recordingState = 'recording'
      this.visualize()
      this.recorder.record()
      clearInterval(this.recordingInterval)
      this.recordingInterval = 0
      this.file.duration = 0
      this.recordingInterval = setInterval(() => {
        if (this.recordingState !== 'pause') {
          this.file.duration++
        }
      }, 1000)
    },
    stopRecording () {
      if (this.recordingState === 'stopped' || this.error.length > 0) {
        return
      }
      window.cancelAnimationFrame(this.drawVisual)
      this.recorder.stop()
      this.createDownloadLink()
      this.recorder.clear()
      this.recordingState = 'stopped'
      clearInterval(this.recordingInterval)
    },
    createDownloadLink () {
      this.recorder && this.recorder.exportWAV((blob) => {
        const url = URL.createObjectURL(blob)
        const au = document.getElementById('audio-recorder')
        au.src = url
        this.file.data = blob
      })
    },
    showUploadForm () {
      if (this.error.length > 0 || !this.validateConversationName()) {
        return
      }
      // eslint-disable-next-line
      $('#modalServerStorage').modal('show')
      if (!this.$store.state.serverStorages) {
        this.$store.dispatch('loadServerStorages')
      }
    },
    async uploadFile (storageName) {
      if (!this.validateConversationName()) {
        return
      }
      if (this.recordingState !== 'stopped') {
        return
      }
      try {
        this.file.isUploading = true
        const formData = new FormData()
        formData.append('file', this.file.data)
        formData.append('storageName', storageName)
        const response = await this.$http.post(`/offline/fileUpload`, formData, {
          onUploadProgress: (progressEvent) => {
            this.file.progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            if (this.file.progress === 100) {
              setTimeout(() => {
                this.file.isUploading = false
              }, 1000)
            }
          }
        })
        if (response.data.message === 'success') {
          // eslint-disable-next-line
          $('#modalServerStorage').modal('hide')

          // clear audio recording data
          this.recorder.clear()
          this.recordingState = 'idle'
          this.recordingInterval = 0
          this.file.duration = 0
        }
      } catch (e) {
        console.log(e)
      }
    },
    changeConversationName () {
      if (!this.validateConversationName()) {
        return
      }
      this.file.name = this.conversationName
      this.file.isEdit = false
    },
    validateConversationName () {
      if (!this.conversationName.trim().length || !this.file.name.trim().length) {
        this.isConversationNameValid = false
        return this.isConversationNameValid
      }
      this.isConversationNameValid = true
      return this.isConversationNameValid
    }
  }
}
</script>

<style lang="scss" scoped>
  .conversation-name {
    .name {
      font-size: 1.25rem;
      font-family: inherit;
      font-weight: 600;
      line-height: 1.5;
      margin-bottom: .5rem;
      color: #32325d;
      border-radius: 4px;
    }
    &:hover {
      .name {
        background: #ddd;
      }
      .edit-icon {
        opacity: 1;
      }
    }
    .edit-icon {
      opacity: 0;
      transition: opacity .15s;
      cursor: pointer;
    }
  }
  .conversation-meta {
    color: #8294a5;
    font-size: 14px;
    display: flex;
  }
  .recording {
    .recording-container {
      text-align: center;
      .recording-actions {
        display: flex;
        justify-content: center;
      }
      .recording-time {
        font-size: 20px;
      }
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .btn-animated-blink {
    animation: 1.5s blink infinite;
  }

  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
