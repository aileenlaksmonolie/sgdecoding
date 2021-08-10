<template>
  <div>
    <div class="col-md-12 mt-5">
      <div class="visualizer-container">
        <canvas class="visualizer"/>
      </div>
    </div>
    <div class="col-md-12 mt-3">
      <div class="row">
        <div class="col-md-12">
          <div class="controls text-center mb-3">
            <div
              class="btn-group"
              role="group"
              aria-label="Basic example">
              <button
                type="button"
                class="btn btn-primary"
                title="Starts listening for speech, i.e. starts recording and transcribing."
                @click="start">
                <i class="fas fa-play"/>
                Start
              </button>
              <button
                type="button"
                title="Stops listening for speech. Speech captured so far will be recognized as if the user had stopped speaking at this point. Note that in the default case, this does not need to be called, as the speech endpointer will automatically stop the recognizer listening when it determines speech has completed."
                class="btn btn-danger"
                @click="stop">
                <i class="fas fa-stop"/>
                Stop
              </button>
              <button
                type="button"
                class="btn btn-warning"
                title="Cancels the speech recognition."
                @click="cancel">
                <i class="fal fa-power-off"/>
                Cancel
              </button>
            </div>
          </div>
          <div
            class="form-group transcription">
            <span
              v-if="status === 2"
              class="is-finish">
              <i class="fal fa-check"/>
            </span>
            <textarea
              :value="transcription + ' ' + partialResult"
              :class="status === 2 ? 'is-valid' : 'form-control-alternative'"
              :disabled="status === 1 ? false : true"
              class="form-control"
              rows="8"
              cols="80"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Record from './Record'
require('@/helpers/dictate/recorder')

export default {
  components: {
    Record
  },
  props: {
    error: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      canvas: {},
      canvasCtx: {},
      drawVisual: {},
      audioCtx: {},
      mediaStream: {},
      audioStream: {},
      analyser: {},
      dataArray: [],
      bufferLength: 0,
      recorder: {},
      recordInterval: 0,
      isSocketReady: false,
      transcription: '',
      partialResult: '',
      status: 0 // 0: init state, 1: ASR in progress, 2: finish
    }
  },
  async mounted () {
    await this.prepare()

    this.$bus.on('stream-record-ready', () => {
      this.isSocketReady = true
      this.status = 1
    })

    this.$bus.on('stream-record-data', data => {
      if (data.result.final) {
        this.transcription += ' ' + data.result.hypotheses[0].transcript
        this.partialResult = ''
      } else {
        this.partialResult = '[...' + data.result.hypotheses[0].transcript + ']'
      }
    })

    this.$bus.on('stream-record-close', () => {
      this.status = 2
      this.$store.commit('SET_DOING_ASR', { isDoingASR: false })
    })
  },
  beforeDestroy () {
    window.cancelAnimationFrame(this.drawVisual)
    const track = this.mediaStream.getTracks()[0] // if only one media track
    track.stop() // Use getTracks()[0].enabled = false

    this.cancel()

    this.$store.commit('SET_DOING_ASR', { isDoingASR: false })
  },
  methods: {
    async prepare () {
      this.canvas = document.querySelector('.visualizer')
      this.canvasCtx = this.canvas.getContext('2d')
      const intendedWidth = document.querySelector('.visualizer-container').clientWidth
      this.canvas.setAttribute('width', intendedWidth)
      this.canvas.setAttribute('height', 200)

      if (intendedWidth / 2 < 500) {
        this.canvas.style.width = intendedWidth + 'px'
      } else {
        this.canvas.style.width = (intendedWidth / 2) + 'px'
      }

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
        this.$emit('onError', 'Your browser doesn\'t support audio recorder. Make sure you grant permission for recording audio and your browser is running with HTTPS')
      }

      if (navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.')
        const constraints = {audio: true}
        try {
          this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

          source = this.audioCtx.createMediaStreamSource(this.mediaStream)
          this.audioStream = source
          // Firefox loses the audio input stream every five seconds
          // To fix added the input to window.source
          // window.source = source
          source.connect(distortion)
          distortion.connect(biquadFilter)
          biquadFilter.connect(gainNode)
          convolver.connect(gainNode)
          gainNode.connect(this.analyser)
          this.analyser.connect(this.audioCtx.destination)
          this.audioCtx.resume()
          this.visualize()

          // eslint-disable-next-line no-undef
          this.recorder = new Recorder(source, { workerPath: '/static/assets/js/lib/recorderWorker.js' })
        } catch (e) {
          console.log('The following error occured: ' + e)
          this.$emit('onError', e.toString())
        }
      } else {
        this.$emit('onError', 'getUserMedia not supported on your browser!')
        console.log('getUserMedia not supported on your browser!')
      }
    },
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

      this.canvasCtx.fillStyle = '#f7fafc'
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
    async checkTokenExpired () {
      try {
        await this.$http.post('/auth/token', {access_token: this.$store.state.user.accessToken})
      } catch (error) {
        this.$emit('onError', error.response.data.message)
      }
    },
    async start () {
      try {
        if (this.$store.state.isDoingASR) {
          return
        }
        this.transcription = ''
        await this.$http.post('/online/record/stream')

        // if success
        this.$root.socket.emit('stream-record-start')

        this.$store.commit('SET_DOING_ASR', { isDoingASR: true })

        this.recordInterval = setInterval(() => {
          this.recorder.export16kMono((blob) => {
            if (this.isSocketReady) {
              this.$root.socket.emit('stream-record-input', blob)
            }
            this.recorder.clear()
          }, 'audio/x-raw')
        }, 250)
        // Start recording
        this.recorder.record()
      } catch (err) {
        console.log(err)
      }
    },
    stop () {
      clearInterval(this.recordInterval)
      // Stop recording
      if (this.recorder) {
        this.recorder.stop()
        // Push the remaining audio to the server
        this.recorder.export16kMono((blob) => {
          if (this.isSocketReady) {
            this.$root.socket.emit('stream-record-stop', blob)
          }
          this.recorder.clear()
        }, 'audio/x-raw')
      } else {
        this.$emit('onError', 'Recorder undefined')
      }
    },
    cancel () {
      // Stop the regular sending of audio (if present)
      clearInterval(this.recordInterval)
      if (this.recorder) {
        this.recorder.stop()
        this.recorder.clear()
        if (this.isSocketReady) {
          this.$root.socket.emit('stream-record-cancel')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.visualizer-container {
  text-align: center;
  .visualizer {
    max-width: 100%;
  }
}
.transcription {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
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
