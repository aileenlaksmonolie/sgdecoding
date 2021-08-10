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
                  v-if="conversation.isEdit"
                  class="form-group">
                  <input
                    v-model="conversationName"
                    type="text"
                    class="form-control form-control-alternative"
                    placeholder="Conversation name..."
                    @keyup.enter="changeConversationName"
                    @blur="changeConversationName">
                </div>
                <div v-else>
                  <span class="name">{{ conversation.name }}</span>
                  <span class="ml-3 edit-icon"><i
                    class="far fa-edit"
                    @click="conversation.isEdit = true"/></span>
                </div>
              </div>
              <div class="conversation-meta">
                <div class="conversation-date">
                  <i class="far fa-calendar-alt"/>
                  <span class="tooltip-custom">
                    {{ conversation.created_at | normalIOSDate }}
                    <span class="tooltiptext">Created date</span>
                  </span>
                </div>
                <div class="conversation-time ml-3">
                  <i class="far fa-clock"/>
                  <span class="tooltip-custom">
                    {{ conversation.duration | toHHMMSS }}
                    <span class="tooltiptext">Duration</span>
                  </span>
                </div>
                <div class="conversation-time ml-3">
                  <i class="fas fa-language"/>
                  <span class="tooltip-custom">
                    {{ conversation.storageName }}
                    <span class="tooltiptext">Language</span>
                  </span>
                </div>
                <div class="conversation-filename ml-3">
                  <i class="fa fa-music"/>
                  <span class="tooltip-custom">
                    {{ conversation.originalFileName }}
                    <span class="tooltiptext">File name</span>
                  </span>
                </div>
              </div>
              <div
                v-if="!conversation.isEdit"
                class="download-icon tooltip-custom">
                <button
                  :disabled="!conversation.isDone"
                  class="btn btn-primary"
                  data-toggle="modal"
                  data-target="#modalDownloadFile">
                  <i class="fa fa-download"/>
                </button>
                <span class="tooltiptext">Download script files</span>
              </div>
            </div>
            <div class="card-body">
              <div class="list-status">
                <div class="list-status-container">
                  <div
                    v-for="(status, index) in conversation.status"
                    :key="index"
                    class="status-item">
                    <span v-if="['CREATED', 'DONE'].includes(status.status)">
                      <i class="fas fa-circle icon-success text-success"/>
                      {{ status.created_at | normalIOSDate }} | {{ status.status }} ...
                    </span>
                    <span v-else>
                      <i class="fa fa-microchip icon-progress" />
                      {{ status.created_at | normalIOSDate }} | {{ status.status }} ...
                      <i
                        v-if="index === conversation.status.length - 1"
                        class="fa fa-spinner fa-spin"/>
                    </span>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="playback-container">
                    <div class="playback-question">
                      <div class="btn-group dropleft">
                        <span
                          id="dropdownQuestion"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false">
                          <i class="far fa-question-circle"/>
                        </span>
                        <div
                          class="dropdown-menu"
                          aria-labelledby="dropdownQuestion"
                          style="min-width: 300px; padding: 0;">
                          <div class="question-container">
                            <div class="question-header">
                              Keyboard Shorcut
                            </div>
                            <div class="question-content">
                              <div class="question-item">
                                <div class="key mr-3">
                                  Space
                                </div>
                                <div class="description">
                                  Play / Pause
                                </div>
                              </div>
                              <div class="question-item">
                                <div class="key mr-3">
                                  &rarr;
                                </div>
                                <div class="description">
                                  Move forward 5s
                                </div>
                              </div>
                              <div class="question-item">
                                <div class="key mr-3">
                                  &larr;
                                </div>
                                <div class="description">
                                  Move backword 5s
                                </div>
                              </div>
                              <div class="question-item">
                                <div class="key mr-3">
                                  &uarr;
                                </div>
                                <div class="description">
                                  Increase playback speed
                                </div>
                              </div>
                              <div class="question-item">
                                <div class="key mr-3">
                                  &darr;
                                </div>
                                <div class="description">
                                  Decrease playback speed
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="playback-control-buttons">
                      <div
                        class="btn-group"
                        role="group"
                        aria-label="Basic example">
                        <button
                          v-if="!isPlaying"
                          class="btn btn-primary"
                          @click="playAudio">
                          <i class="fa fa-play"/>
                        </button>
                        <button
                          v-else
                          class="btn btn-primary"
                          @click="pauseAudio">
                          <i class="fa fa-pause"/>
                        </button>
                        <button
                          id="dropdownPlaybackOption"
                          class="btn btn-secondary"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false">
                          <span>{{ currentPlaybackRate }}x</span>
                          <div class="dropdown">
                            <div
                              class="dropdown-menu p-0"
                              aria-labelledby="dropdownPlaybackOption"
                              style="margin-top: -20px;">
                              <div class="playback-rate">
                                <div class="playback-rate-header p-3">
                                  Playback Options
                                </div>
                                <div class="playback-rate-content p-3">
                                  <div class="playback-rate-title mb-2">
                                    Speed
                                  </div>
                                  <div class="list-playback-rates mb-2">
                                    <div
                                      v-for="n in listPlaybackRates"
                                      :class="{active: currentPlaybackRate === n}"
                                      :key="n"
                                      class="playback-rate-item"
                                      @click="changePlaybackRate(n)">
                                      {{ n }}x
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div class="playback-progress-bar">
                      <div class="playback-progress-bar-message">
                        {{ currentPlaybackRate }}x
                      </div>
                      <div
                        id="progress-slider"
                        class="playback-progress-bar-slider"
                        @click="seekAudio">
                        <span
                          id="progress-bar"
                          class="playback-progress-bar-overlay"/>
                        <span
                          id="handle-bar"
                          class="playback-progress-bar-handlebar"/>
                      </div>
                    </div>
                    <div class="playback-play-timestamps">
                      <span>{{ currentPlaybackTime | toHHMMSS }}</span>
                      <span>/</span>
                      <span>{{ conversation.duration | toHHMMSS }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModalDownloadFile :conversation="conversation"/>
  </div>
</template>

<script>
import ModalDownloadFile from './ModalDownloadFile'

export default {
  components: {
    ModalDownloadFile
  },
  data () {
    return {
      conversation: {},
      conversationName: '',
      audio: {},
      isPlaying: false,
      currentPlaybackTime: 0,
      listPlaybackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3],
      currentPlaybackRate: 1,
      HTMLProgressBar: {},
      HTMLHandleBar: {},
      HTMLSlider: {},
      HTMLStatusContainer: {}
    }
  },
  mounted () {
    this.getConversationById()
    this.HTMLSlider = document.getElementById('progress-slider')
    this.HTMLProgressBar = document.getElementById('progress-bar')
    this.HTMLHandleBar = document.getElementById('handle-bar')
    this.HTMLStatusContainer = document.querySelector('.list-status-container')

    this.$bus.on('status', data => {
      if (data.fileName === this.conversation.fileName) {
        this.conversation.status.push({
          status: data.status,
          created_at: data.created_at
        })
        this.conversation.isDone = data.isDone
        if (data.isDone) {
          this.$set(this.conversation, 'files', data.files)
        }
        this.scrollToBottom()
      }
    })

    document.addEventListener('keyup', this.onKeyup)
  },
  beforeDestroy () {
    this.audio.pause()
    this.audio = null
    document.removeEventListener('keyup', this.onKeyup)
  },
  methods: {
    onKeyup (e) {
      if (e.keyCode === 39) { // listen for Enter keyup event, if press Enter then we call method `login`
        this.changePlayBackTime(1)
      } else if (e.keyCode === 37) {
        this.changePlayBackTime(-1)
      } else if (e.keyCode === 32) {
        if (this.audio.paused) {
          this.audio.play()
        } else {
          this.audio.pause()
        }
      } else if (e.keyCode === 38) {
        this.changePlaybackRate('up')
      } else if (e.keyCode === 40) {
        this.changePlaybackRate('down')
      }
    },
    async getConversationById () {
      try {
        const response = await this.$http.get(`/offline/conversations/${this.$route.params.id}`)
        this.conversation = response.data.conversation
        this.$set(this.conversation, 'isEdit', false)
        this.conversationName = this.conversation.name
        await this.initAudio()
        this.scrollToBottom()
      } catch (e) {
        console.log(e)
      }
    },
    async changeConversationName () {
      try {
        this.conversation.name = this.conversationName
        const response = await this.$http.put(`/offline/conversations/${this.conversation._id}`, {
          name: this.conversation.name
        })
        if (response.data.message === 'success') {
          this.conversation.isEdit = false
        }
      } catch (e) {
        console.log(e)
      }
    },
    playAudio () {
      this.audio.play()
    },
    pauseAudio () {
      this.audio.pause()
    },
    async initAudio () {
      try {
        this.audio = new Audio(`${this.$store.state.baseUrl}/${this.conversation.path.substring(7)}`)

        this.audio.onplay = () => {
          this.isPlaying = true
        }

        this.audio.onpause = () => {
          this.isPlaying = false
        }

        this.audio.ontimeupdate = (event) => {
          if (this.audio) {
            this.currentPlaybackTime = this.audio.currentTime
            const percentWidth = (this.audio.currentTime / this.conversation.duration) * 100
            this.HTMLProgressBar.style.width = percentWidth + '%'
            this.HTMLHandleBar.style.left = percentWidth + '%'
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
    seekAudio (event) {
      const offsetX = event.offsetX
      const width = this.HTMLSlider.offsetWidth
      this.audio.currentTime = (offsetX / width) * this.conversation.duration
    },
    scrollToBottom () {
      // eslint-disable-next-line
      $(this.HTMLStatusContainer).animate(
        { scrollTop: this.HTMLStatusContainer.scrollHeight },
        { duration: 'medium', easing: 'swing' }
      )
    },
    changePlaybackRate (value) {
      if (value === 'up' || value === 'down') {
        const index = this.listPlaybackRates.findIndex(item => item === this.currentPlaybackRate)
        if (value === 'up') {
          if (index === this.listPlaybackRates.length - 1) {
            return
          } else {
            this.currentPlaybackRate = this.listPlaybackRates[index + 1]
          }
        } else if (value === 'down') {
          if (index === 0) {
            return
          } else {
            this.currentPlaybackRate = this.listPlaybackRates[index - 1]
          }
        }
      } else {
        this.currentPlaybackRate = value
      }
      this.audio.playbackRate = this.currentPlaybackRate
    },
    changePlayBackTime (value) {
      if (value === 1) {
        this.currentPlaybackTime += 5
      } else {
        this.currentPlaybackTime -= 5
      }
      this.audio.currentTime = this.currentPlaybackTime
    }
  }
}
</script>

<style lang="scss" scoped>
  $playbackBarTransitionDuration: .4s;
  .card-header {
    position: relative;
    .download-icon {
      position: absolute;
      top: 45px;
      right: 40px;
      transform: translateY(-50%);
    }
  }
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
  .playback-container {
    border: 1px solid #eff0f2;
    background: #fbfbfb;
    border-radius: 6px;
    display: flex;
    align-items: center;
    position: relative;
    padding: 1rem 0;
    .playback-question {
      position: absolute;
      top: .4rem;
      right: .4rem;
      color: #b4bfc9;
      cursor: pointer;
      transition: color .15s;
      &:hover {
        color: black;
      }
      .question-container {
        .question-header {
          font-weight: 600;
          padding: 15px;
          border-bottom: solid 1px #e7e7e7;
        }
        .question-content {
          padding: 15px;
          .question-item {
            display: flex;
            align-items: center;
            .key {
              font-weight: 600;
              font-size: 14px;
            }
          }
        }
      }
    }
    .playback-control-buttons {
      margin: 0 2rem;
      flex: 0;
      .playback-rate {
        .playback-rate-header {
          border-bottom: solid 1px #e7e7e7;
        }
        .playback-rate-content {
          font-weight: 400;
          .list-playback-rates {
            display: flex;
            .playback-rate-item {
              font-size: 14px;
              cursor: pointer;
              &:hover {
                color: #007aff;
              }
              &.active {
                color: #007aff;
                font-weight: 600;
              }
            }
            .playback-rate-item:not(:last-child) {
              margin-right: 15px;
            }
          }
        }
      }
    }
    .playback-progress-bar {
      flex: 1;
      position: relative;
      .playback-progress-bar-message {
        text-align: center;
        position: absolute;
        top: -30px;
        left: 50%;
      }
      .playback-progress-bar-slider {
        position: absolute;
        top: 0;
        width: 100%;
        height: .3rem;
        cursor: pointer;
        background-clip: content-box;
        border-radius: .4rem;
        background: #eceef1;
        .playback-progress-bar-overlay {
          position: absolute;
          display: inline-block;
          height: .3rem;
          border-radius: .4rem;
          transition-duration: $playbackBarTransitionDuration;
          transition-timing-function: cubic-bezier(.25,.8,.25,1);
          transition-property: width;
          background: #007aff;
        }
        .playback-progress-bar-handlebar {
          position: absolute;
          display: inline-block;
          width: 1rem;
          height: 1rem;
          outline: 0;
          margin-top: -.35rem;
          margin-left: -.7rem;
          border-radius: 50%;
          transition-duration: $playbackBarTransitionDuration;
          transition-timing-function: cubic-bezier(.25,.8,.25,1);
          transition-property: left;
          background: #007aff;
        }
      }
    }
    .playback-play-timestamps {
      flex: 0;
      display: flex;
      align-items: center;
      margin: 0 2rem;
    }
  }
  .list-status {
    .list-status-container {
      height: 300px;
      overflow-y: scroll;
      width: 100%;
      .status-item {
        .icon-progress {
          color: #8194a6;
        }
      }
      .status-item:last-child {
        margin-bottom: 1rem;
      }
    }
  }

  @media (max-width: 576px) {
    .conversation-name {
      margin-bottom: 1.5rem;
    }
    .playback-container {
      flex-direction: column;
      .playback-progress-bar {
        width: 80%;
        margin-top: 50px;
        margin-bottom: 20px;
      }
    }
  }
</style>
