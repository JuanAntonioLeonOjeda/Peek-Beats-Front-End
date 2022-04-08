import io from 'socket.io-client'
import Vue from 'vue'

const socket = io('http://localhost:5000')
Vue.prototype.$socket = socket

export default socket
