<template>
  <!-- <div id="mainFrame">
    <div v-if="streamerRole">
      <video class="bigCinema" ref="localVideo" autoplay muted>LocalVideo</video>
      <video class="remoteVideo" ref="remoteVideo" autoplay>RemoteVideo</video>
    </div>
    <div v-else>
      <video class="bigCinema" ref="remoteVideo" autoplay>RemoteVideo</video>
      <video class="remoteVideo" ref="localVideo" autoplay muted>LocalVideo</video>
    </div>
    <div class="bottom-bar d-flex justify-center">
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
      <StopStream v-if="streamerRole" />
      <AddFavouriteStreamer v-else />
    </div>
  </div> -->
  <div>
    <NavBar />
    <NavigationDrawer />
    <v-container position="relative">
      <v-row>
        <v-col
          cols="12"
          md="12"
          lg="12"
        >
          <div class="text-center">
            <div id="mainFrame">
              <v-card>
                <div v-if="streamerRole">
                  Your stream room is: {{ room }}
                </div>
                <v-card-title>
                  <div v-if="streamerRole">
                  Welcome: {{ $auth.user.userName }}
                  </div>
                  <div v-else>
                  You are watching: {{ stream.streamer.userName }}
                  </div>
                  <v-spacer />
                  <v-icon class="mr-3">
                    mdi-account-group
                  </v-icon>
                  <span v-if="stream.currentViewers !== []">
                    {{ getTotalViewers }}
                  </span>
                  <span v-else>
                    0
                  </span>
                </v-card-title>

                <div>
                  <video id="video" class="bigCinema" autoplay>LocalVideo</video>
                </div>

                <v-card-subtitle class="pa-0 mt-5">
                  <div v-if="streamerRole">
                    Music genre: {{ genre }}
                  </div>
                  <div v-else>
                    Music genre: {{ stream.genre.name }}
                  </div>
                </v-card-subtitle>
                <v-card-subtitle class="pa-0">
                  <v-btn v-if="streamerRole" icon @click="editDescription">
                    <v-icon>mdi-square-edit-outline</v-icon>
                  </v-btn>
                  {{ stream.description }}
                </v-card-subtitle>

                <v-card-actions>
                  <v-container>
                    <v-row>
                      <v-col>
                        <div class="text-center">
                          <div v-if="streamerRole" >
                          <StopStream />
                          <v-spacer />
                            <v-btn class="mx-2" fab>
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
                          <AddFavouriteStreamer v-else />
                        <!-- <v-btn
                          v-if="role !== 'streamer'"
                          icon
                          :@click="like = !like"
                        >
                        <v-icon color="red">{{ like ? 'mdi-cards-heart' : 'mdi-cards-heart-outline' }}</v-icon>
                        </v-btn> -->
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-actions>
              </v-card>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import StopStream from '@/components/StopStream.vue'
import AddFavouriteStreamer from '@/components/AddFavouriteStreamer.vue'
import NavigationDrawer from '@/components/NavigationDrawer.vue'

// const servers = {
//   configuration: {
//     offerToReceiveAudio: true,
//     offerToReceiveVideo: true
//   },
//   iceServers: [
//     { urls: 'stun:stun.l.google.com:19302' },
//     { urls: 'stun:stun1.l.google.com:19302' }
//   ]
// }
// const RPC = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
// const localPC = new RPC(servers)

export default {
  components: {
    StopStream,
    AddFavouriteStreamer,
    NavigationDrawer
  },
  data () {
    return {
      room: this.$route.params.id,
      streamerRole: this.$store.state.streamer,
      userName: '',
      stream: this.$store.state.streamInfo,
      like: false,
      genre: this.$store.state.genreName
    }
  },
  computed: {
    getTotalViewers () {
      return this.stream.currentViewers.length
    }
  },
  // async beforeMount () {
  //   const lastId = localStorage.getItem('lastId')
  //   if (lastId) {
  //     await this.$socket.emit('leave', this.room)
  //   }
  //   await this.$socket.emit('join', lastId)
  //   localStorage.setItem('lastId', this.room)
  // },
  async mounted () {
    if (this.streamerRole) {
      const peerConnections = {}
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      document.getElementById('video').srcObject = stream
      this.$socket.emit('broadcaster')

      const peer = createStreamerPeer()

      this.$socket.emit('join-room', this.$route.params.id, this.$auth.user.userName)

      this.$socket.on('watcher', (id) => {
        console.log('watcher joined: ' + id)

        peerConnections[id] = peer

        stream.getTracks().forEach((track) => {
          peer.addTrack(track, stream)
        })

        peer.onicecandidate = (e) => {
          if (e.candidate) {
            this.$socket.emit('candidate', id, e.candidate)
          }
        }
        const socket = this.$socket
        handleNegotiationNeededEvent(peer, socket, id)
      })

      function createStreamerPeer (store) {
        const peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: 'stun:stun.l.google.com:19302'
            }
          ]
        })
        // peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer, store)

        return peer
      }
      async function handleNegotiationNeededEvent (peer, socket, id) {
        const offer = await peer.createOffer()
        await peer.setLocalDescription(offer)
        socket.emit('offer', id, peer.localDescription)
        console.log('offer emitted')
      }

      this.$socket.on('answer', (id, description) => {
        peerConnections[id].setRemoteDescription(description)
      })

      this.$socket.on('user-connected', (name) => {
        console.log(`${name} has joined the room`)
      })

      this.$socket.on('candidate', (id, candidate) => {
        peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate))
      })
      // async function handleNegotiationNeededEvent (peer, store) {
      //   const offer = await peer.createOffer()
      //   await peer.setLocalDescription(offer)
      //   const payloadData = {
      //     sdp: peer.localDescription
      //   }
      //   const result = await store.dispatch('broadcast', payloadData)
      //   console.log('result: ' + result)
      //   const description = new RTCSessionDescription(result.sdp)
      //   console.log(description)
      //   peer.setRemoteDescription(description).catch(e => console.log(e))
      // }

      this.$socket.on('disconnectPeer', (id) => {
        peerConnections[id].close()
        delete peerConnections[id]
      })
    } else {
      console.log('viewer')
      let peer
      const store = this.$store
      this.$socket.emit('watcher')

      this.$socket.emit('join-room', this.$route.params.id, this.$auth.user.userName)

      this.$socket.on('offer', (id, description) => {
        console.log('on offer')
        const peer = createViewerPeer(store)
        peer
          .setRemoteDescription(description)
          .then(() => peer.createAnswer())
          .then(sdp => peer.setLocalDescription(sdp))
          .then(() => {
            this.$socket.emit('answer', id, peer.localDescription)
            console.log('answer emitted')
          })
        peer.ontrack = (e) => {
          handleTrackEvent(e)
        }
        peer.onicecandidate = (e) => {
          if (e.candidate) {
            this.$socket.emit('candidate', id, e.candidate)
          }
        }
      })
      // peer.addTransceiver('video', { direction: 'recvonly' })

      function createViewerPeer (store) {
        peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: 'stun:stun.l.google.com:19302'
            }
          ]
        })
        // peer.ontrack = handleTrackEvent
        // peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer, store)

        return peer
      }

      // async function handleNegotiationNeededEvent (peer, store) {
      //   const offer = await peer.createOffer()
      //   await peer.setLocalDescription(offer)
      //   const payloadData = {
      //     sdp: peer.localDescription
      //   }

      //   const result = await store.dispatch('receiveStream', payloadData)

      //   const description = new RTCSessionDescription(result.sdp)
      //   peer.setRemoteDescription(description).catch(e => console.log(e))
      // }

      function handleTrackEvent (e) {
        document.getElementById('video').srcObject = e.streams[0]
      }

      this.$socket.on('candidate', (id, candidate) => {
        peer
          .addIceCandidate(new RTCIceCandidate(candidate))
          .catch(e => console.error(e))
      })

      this.$socket.on('broadcaster', () => {
        console.log('on broadcaster')
        this.$socket.emit('watcher')
      })

      this.$socket.on('user-connected', (name) => {
        console.log(`${name} has joined the room`)
      })
    }
  },
  //   const offer = await localPC.createOffer()
  //   await localPC.setLocalDescription(offer)
  //   await this.$socket.emit('message', JSON.stringify({
  //     room: this.room,
  //     data: localPC.localDescription
  //   }))
  //   localPC.onicecandidate = async (event) => {
  //     if (event.candidate) {
  //       await this.$socket.emit('message', JSON.stringify({
  //         room: this.room,
  //         data: event.candidate
  //       }))
  //     } else {
  //       // eslint-disable-next-line
  //       console.log('allhasbeensent')
  //     }
  //   }
  //   localPC.ontrack = (event) => {
  //     if (event.streams[0]) {
  //       this.$refs.remoteVideo.srcObject = event.streams[0]
  //     }
  //   }
  //   this.$socket.on('message', async (data) => {
  //     if (data.type === 'offer') {
  //       await localPC.setRemoteDescription(new RTCSessionDescription(data))
  //       const answer = await localPC.createAnswer()
  //       await localPC.setLocalDescription(answer)
  //       await this.$socket.emit('message', JSON.stringify({
  //         room: this.room,
  //         data: localPC.localDescription
  //       }))
  //     } else if (data.type === 'answer') {
  //       await localPC.setRemoteDescription(new RTCSessionDescription(data))
  //     } else {
  //       await localPC.addIceCandidate(new RTCIceCandidate(data))
  //     }
  //   })
  // },
  // async beforeDestroy () {
  //   await this.$socket.emit('leave', this.room)
  // },
  methods: {
    offCamera () {
      this.$store.state.setting.camera.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
    }
  }
}
</script>

<style lang="scss">
  #mainFrame {
  width: 95%;
  position: absolute;
  left: 40px;
    .bigCinema {
      z-index: 50;
      height: calc(70vh - 90px);
      width: 100%;
      background-color: #7f828b  31;
    }

    .bottom-bar {
      position: absolute;
      bottom: 25px;
      width: 100vw;
      text-align: center;
    }
  }
  .remoteVideo {
    display: none;
  }
</style>
