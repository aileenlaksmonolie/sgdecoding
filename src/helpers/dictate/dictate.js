// /* eslint-disable */
(function (window) {
  // Defaults
  const SERVER = 'ws://bark.phon.ioc.ee:82/dev/duplex-speech-api/ws/speech'
  const SERVER_STATUS = 'ws://bark.phon.ioc.ee:82/dev/duplex-speech-api/ws/status'
  const REFERENCE_HANDLER = 'http://bark.phon.ioc.ee:82/dev/duplex-speech-api/dynamic/reference'
  const CONTENT_TYPE = 'content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1'
  const TOKEN = 'MYTOKEN'
  // Send blocks 4 x per second as recommended in the server doc.
  const INTERVAL = 250
  const TAG_END_OF_SENTENCE = 'EOS'
  const RECORDER_WORKER_PATH = 'recorderWorker.js'

  // Error codes (mostly following Android error names and codes)
  const ERR_NETWORK = 2
  const ERR_AUDIO = 3
  const ERR_SERVER = 4
  const ERR_CLIENT = 5

  // Event codes
  const MSG_WAITING_MICROPHONE = 1
  const MSG_MEDIA_STREAM_CREATED = 2
  const MSG_INIT_RECORDER = 3
  // const MSG_RECORDING = 4
  const MSG_SEND = 5
  const MSG_SEND_EMPTY = 6
  const MSG_SEND_EOS = 7
  const MSG_WEB_SOCKET = 8
  const MSG_WEB_SOCKET_OPEN = 9
  const MSG_WEB_SOCKET_CLOSE = 10
  const MSG_STOP = 11
  const MSG_SERVER_CHANGED = 12

  // Server status codes
  // from https://github.com/alumae/kaldi-gstreamer-server
  const SERVER_STATUS_CODE = {
    0: 'Success', // Usually used when recognition results are sent
    1: 'No speech', // Incoming audio contained a large portion of silence or non-speech
    2: 'Aborted', // Recognition was aborted for some reason
    9: 'No available / Authentication error' // Recognizer processes are currently in use and recognition cannot be performed
  }

  const Dictate = function (cfg) {
    const config = cfg || {}
    config.server = config.server || SERVER
    config.audioSourceId = config.audioSourceId
    config.serverStatus = config.serverStatus || SERVER_STATUS
    config.referenceHandler = config.referenceHandler || REFERENCE_HANDLER
    config.contentType = config.contentType || CONTENT_TYPE
    config.token = config.token || TOKEN
    config.interval = config.interval || INTERVAL
    config.recorderWorkerPath = config.recorderWorkerPath || RECORDER_WORKER_PATH
    config.onReadyForSpeech = config.onReadyForSpeech || function () {}
    config.onEndOfSpeech = config.onEndOfSpeech || function () {}
    config.onPartialResults = config.onPartialResults || function (data) {}
    config.onResults = config.onResults || function (data) {}
    config.onEndOfSession = config.onEndOfSession || function () {}
    config.onEvent = config.onEvent || function (e, data) {}
    config.onError = config.onError || function (e, data) {}
    config.rafCallback = config.rafCallback || function (time) {}

    this.audioCtx = config.audioCtx
    this.audioStream = config.audioStream

    if (config.onServerStatus) {
      monitorServerStatus()
    }

    // Initialized by init()
    this.recorder = null
    const self = this
    // Initialized by startListening()
    let ws
    let intervalKey
    // Initialized during construction
    let wsServerStatus

    // Returns the configuration
    this.getConfig = function () {
      return config
    }

    // Set up the recorder (incl. asking permission)
    // Initializes audioContext
    // Can be called multiple times.
    // TODO: call something on success (MSG_INIT_RECORDER is currently called)
    this.init = function () {
      config.onEvent(MSG_WAITING_MICROPHONE, 'Waiting for approval to access your microphone ...')
      startUserMedia()
    }

    // Start recording and transcribing
    this.startListening = function () {
      if (!self.recorder) {
        config.onError(ERR_AUDIO, 'Recorder undefined')
        return
      }

      if (ws) {
        // eslint-disable-next-line no-undef
        cancel()
      }

      try {
        ws = createWebSocket()
      } catch (e) {
        config.onError(ERR_CLIENT, 'No web socket support in this browser!')
      }
    }

    // Stop listening, i.e. recording and sending of new input.
    this.stopListening = function () {
      // Stop the regular sending of audio
      clearInterval(intervalKey)
      // Stop recording
      if (self.recorder) {
        self.recorder.stop()
        config.onEvent(MSG_STOP, 'Stopped recording')
        // Push the remaining audio to the server
        self.recorder.export16kMono(function (blob) {
          socketSend(blob)
          socketSend(TAG_END_OF_SENTENCE)
          self.recorder.clear()
        }, 'audio/x-raw')
        config.onEndOfSpeech()
      } else {
        config.onError(ERR_AUDIO, 'Recorder undefined')
      }
    }

    // Cancel everything without waiting on the server
    this.cancel = function () {
      // Stop the regular sending of audio (if present)
      clearInterval(intervalKey)
      if (self.recorder) {
        self.recorder.stop()
        self.recorder.clear()
        config.onEvent(MSG_STOP, 'Stopped recording')
      }
      if (ws) {
        ws.close()
        ws = null
      }
    }

    // Sets the URL of the speech server
    this.setServer = function (server) {
      config.server = server
      config.onEvent(MSG_SERVER_CHANGED, 'Server changed: ' + server)
    }

    // Sets the URL of the speech server status server
    this.setServerStatus = function (serverStatus) {
      config.serverStatus = serverStatus

      if (config.onServerStatus) {
        monitorServerStatus()
      }

      config.onEvent(MSG_SERVER_CHANGED, 'Server status server changed: ' + serverStatus)
    }

    // Private methods
    function startUserMedia () {
      config.onEvent(MSG_MEDIA_STREAM_CREATED, 'Media stream created')
      // Firefox loses the audio input stream every five seconds
      // To fix added the input to window.source
      window.source = config.audioStream

      // // make the analyser available in window context
      window.userSpeechAnalyser = config.audioCtx.createAnalyser()
      config.audioStream.connect(window.userSpeechAnalyser)

      config.rafCallback()

      // eslint-disable-next-line no-undef
      self.recorder = new Recorder(config.audioStream, { workerPath: config.recorderWorkerPath })
      config.onEvent(MSG_INIT_RECORDER, 'Recorder initialized')
    }

    function socketSend (item) {
      if (ws) {
        const state = ws.readyState
        if (state === 1) {
          // If item is an audio blob
          if (item instanceof Blob) {
            if (item.size > 0) {
              ws.send(item)
              config.onEvent(MSG_SEND, 'Send: blob: ' + item.type + ', ' + item.size)
            } else {
              config.onEvent(MSG_SEND_EMPTY, 'Send: blob: ' + item.type + ', EMPTY')
            }
            // Otherwise it's the EOS tag (string)
          } else {
            ws.send(item)
            config.onEvent(MSG_SEND_EOS, 'Send tag: ' + item)
          }
        } else {
          config.onError(ERR_NETWORK, 'WebSocket: readyState!=1: ' + state + ': failed to send: ' + item)
        }
      } else {
        config.onError(ERR_CLIENT, 'No web socket connection: failed to send: ' + item)
      }
    }

    function createWebSocket () {
      // TODO: do we need to use a protocol?
      // var ws = new WebSocket("ws://127.0.0.1:8081", "echo-protocol");
      let url = config.server + '?' + config.contentType + '?token=' + config.token
      if (config['user_id']) {
        url += '&user-id=' + config['user_id']
      }
      if (config['content_id']) {
        url += '&content-id=' + config['content_id']
      }
      const ws = new WebSocket(url)

      ws.onmessage = function (e) {
        const data = e.data
        config.onEvent(MSG_WEB_SOCKET, data)
        if (data instanceof Object && !(data instanceof Blob)) {
          config.onError(ERR_SERVER, 'WebSocket: onEvent: got Object that is not a Blob')
        } else if (data instanceof Blob) {
          config.onError(ERR_SERVER, 'WebSocket: got Blob')
        } else {
          const res = JSON.parse(data)
          if (res.status === 0) {
            if (res.result) {
              if (res.result.final) {
                config.onResults(res.result.hypotheses)
              } else {
                config.onPartialResults(res.result.hypotheses)
              }
            }
          } else {
            config.onError(ERR_SERVER, 'Server error: ' + res.status + ': ' + getDescription(res.status))
          }
        }
      }

      // Start recording only if the socket becomes open
      ws.onopen = function (e) {
        intervalKey = setInterval(function () {
          self.recorder.export16kMono(function (blob) {
            socketSend(blob)
            self.recorder.clear()
          }, 'audio/x-raw')
        }, config.interval)
        // Start recording
        self.recorder.record()
        config.onReadyForSpeech()
        config.onEvent(MSG_WEB_SOCKET_OPEN, e)
      }

      // This can happen if the blob was too big
      // E.g. "Frame size of 65580 bytes exceeds maximum accepted frame size"
      // Status codes
      // http://tools.ietf.org/html/rfc6455#section-7.4.1
      // 1005:
      // 1006:
      ws.onclose = function (e) {
        // The server closes the connection (only?)
        // when its endpointer triggers.
        config.onEndOfSession()
        config.onEvent(MSG_WEB_SOCKET_CLOSE, e.code + '/' + e.reason + '/' + e.wasClean)
      }

      ws.onerror = function (e) {
        const data = e.data
        config.onError(ERR_NETWORK, data)
      }

      return ws
    }

    function monitorServerStatus () {
      if (wsServerStatus) {
        wsServerStatus.close()
      }
      wsServerStatus = new WebSocket(config.serverStatus)
      wsServerStatus.onmessage = function (evt) {
        config.onServerStatus(JSON.parse(evt.data))
      }
    }

    function getDescription (code) {
      if (code in SERVER_STATUS_CODE) {
        return SERVER_STATUS_CODE[code]
      }
      return 'Unknown error'
    }
  }

  // Simple class for persisting the transcription.
  // If isFinal==true then a new line is started in the transcription list
  // (which only keeps the final transcriptions).
  const Transcription = function (cfg) {
    let index = 0
    const list = []

    this.add = function (text, isFinal) {
      list[index] = text
      if (isFinal) {
        index++
      }
    }

    this.toString = function () {
      return list.join('. ')
    }
  }

  window.Dictate = Dictate
  window.Transcription = Transcription
})(window)
