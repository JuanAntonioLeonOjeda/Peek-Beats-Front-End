import io from 'socket.io-client'
import Vue from 'vue'

const socket = io('https://peek-beats.herokuapp.com')
Vue.prototype.$socket = socket

export default socket
