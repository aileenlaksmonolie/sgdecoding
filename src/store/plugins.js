import io from 'socket.io-client'

let socket

function initSocket () {
  socket = io(this.baseUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity
  })
}

function socketPlugin () {

}

export default socketPlugin
