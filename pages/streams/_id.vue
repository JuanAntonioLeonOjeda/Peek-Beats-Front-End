<template>
  <div id="mainFrame">
    Your stream room is: {{ roomId }}
    <video id="localVideo" ref="localVideo" autoplay muted>LocalVideo</video>
    <video id="remoteVideo" ref="remoteVideo" autoplay>RemoteVideo</video>
    <div v-if="role === 'streamer'" class="bottom-bar d-flex justify-center">
      <v-btn class="mx-2" fab @click="offCamera()">
        <v-icon dark>
          mdi-camera
        </v-icon>
      </v-btn>
      <v-btn class="mx-2" fab>
        <v-icon dark>
          mdi-microphone
        </v-icon>
      </v-btn>
    </div>
    <!-- <StreamVideo /> -->

    <StopStream v-if="role === 'streamer'" />
  </div>
</template>

<script>

const servers = {
  configuration: {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  },
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
}

const RPC = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
const localPC = new RPC(servers)

export default {
  name: 'StreamPage',
  data () {
    return {
      roomId: this.$route.params.id,
      role: this.$store.state.role
    }
  },
  async beforeMount () {
    const lastId = localStorage.getItem('lastId')
    console.log('lastId: ' + lastId)
    if (lastId) {
      await this.$socket.emit('leave', lastId)
    }
    await this.$socket.emit('join', this.roomId)
    localStorage.setItem('lastId', this.roomId)
  },
  async mounted () {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })

    this.$refs.localVideo.srcObject = stream
    this.$store.commit('setCamera', {
      camera: stream
    })

    stream.getTracks().forEach((track) => {
      localPC.addTrack(track, stream)
    })

    const offer = await localPC.createOffer()
    await localPC.setLocalDescription(offer)
    console.log('offer: ' + offer)
    console.log('localPC: ' + localPC)
    await this.$socket.emit('message', JSON.stringify({
      room: this.roomId,
      data: localPC.localDescription
    }))
    console.log('message emitted')
    localPC.onicecandidate = async (event) => {
      console.log('event onicecandidate: ' + event)
      if (event.candidate) {
        console.log('enent.candidate = true => ' + event.candidate)
        await this.$socket.emit('message', JSON.stringify({
          room: this.roomId,
          data: event.candidate
        }))
      } else {
        // eslint-disable-next-line
        console.log('allhasbeensent')
      }
    }
    localPC.ontrack = (event) => {
      console.log('ontrack event:' + event)
      console.log(event.streams)
      if (event.streams[0]) {
        console.log(event.streams[0])
        this.$refs.remoteVideo.srcObject = event.streams[0]
      }
    }
    this.$socket.on('message', async (data) => {
      if (data.type === 'offer') {
        console.log('offer: ' + offer)
        await localPC.setRemoteDescription(new RTCSessionDescription(data))
        const answer = await localPC.createAnswer()
        await localPC.setLocalDescription(answer)
        await this.$socket.emit('message', JSON.stringify({
          room: this.roomId,
          data: localPC.localDescription
        }))
      } else if (data.type === 'answer') {
        console.log('answer:' + data)
        await localPC.setRemoteDescription(new RTCSessionDescription(data))
      } else {
        await localPC.addIceCandidate(new RTCIceCandidate(data))
      }
    })
  },
  async beforeDestroy () {
    await this.$socket.emit('leave', this.roomId)
  },
  methods: {
    offCamera () {
      this.$store.state.camera.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 #mainFrame {
    #localVideo {
      z-index: 100;
      position: absolute;
      right: 25px;
      bottom: 25px;
      background-color: #47494e;
      height: 150px;
      width: 200px;
    }
    #remoteVideo {
      z-index: 50;
      height: calc(100vh - 64px);
      width: 100vw;
      background-color: #7f828b;
    }
    .bottom-bar {
      position: absolute;
      bottom: 25px;
      width: 100vw;
      text-align: center;
    }
  }
</style>
