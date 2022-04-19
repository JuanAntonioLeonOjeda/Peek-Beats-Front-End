<template>
  <div>
    <!-- <NavBar /> -->
    <NavigationDrawer />
    <v-row>
      <v-col
        cols="8"
        class="ml-15 pa-5"
      >
        <v-card id="screen" flat color="mainCards">
          <div>
            <video id="video" class="bigCinema" autoplay>LocalVideo</video>
          </div>
        </v-card>
      </v-col>
      <v-spacer />
      <v-col
        cols="3"
        class="mr-15 pa-5"
      >
        <StreamChat />
      </v-col>
    </v-row>
    <v-card flat class="text-center" color="mainCards">
      <v-card-title class="ml-50">
        <div v-if="streamerRole">
          {{ $auth.user.userName }}, you are streaming!
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
      <v-card-subtitle class="pa-0 mt-5">
        <div v-if="streamerRole">
          Music genre: {{ genre }}
        </div>
        <div v-else>
          Music genre: {{ stream.genre.name }}
        </div>
      </v-card-subtitle>
      <v-card-subtitle class="pa-0">
        <!-- @click="editDescription" -->
        <v-btn v-if="streamerRole" icon>
          <v-icon>mdi-square-edit-outline</v-icon>
        </v-btn>
        {{ stream.description }}
      </v-card-subtitle>
      <v-card-actions>
        <v-row>
          <v-col>
            <div class="text-center">
              <div v-if="streamerRole">
                <StopStream />
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
            </div>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import StreamChat from '@/components/StreamChat.vue'
import StopStream from '@/components/StopStream.vue'
import AddFavouriteStreamer from '@/components/AddFavouriteStreamer.vue'
import NavigationDrawer from '@/components/NavigationDrawer.vue'

export default {
  components: {
    StopStream,
    AddFavouriteStreamer,
    NavigationDrawer,
    StreamChat
  },
  data () {
    return {
      room: this.$route.params.id,
      streamerRole: this.$store.state.streamer,
      userName: this.$auth.user.userName,
      stream: this.$store.state.streamInfo,
      like: false,
      genre: this.$store.state.genreName,
      viewers: 0
    }
  },
  computed: {
    getTotalViewers () {
      return this.viewers
    }
  },
  async mounted () {
    !this.$auth.loggedIn ? this.$router.push({ path: '/' }) : console.log('allGood')
    if (this.streamerRole) {
      if (this.$socket.disconnected) {
        await this.$socket.connect()
      }
      const peerConnections = {}
      this.viewers = Object.keys(peerConnections).length
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      document.getElementById('video').srcObject = stream
      await this.$socket.emit('join-room', this.$route.params.id, this.$auth.user.userName)
      await this.$socket.emit('broadcaster')

      this.$socket.on('watcher', (id) => {
        const peer = createStreamerPeer()

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

        return peer
      }
      async function handleNegotiationNeededEvent (peer, socket, id) {
        const offer = await peer.createOffer()
        await peer.setLocalDescription(offer)
        await socket.emit('offer', id, peer.localDescription)
      }

      this.$socket.on('answer', (id, description) => {
        peerConnections[id].setRemoteDescription(description)
      })

      this.$socket.on('user-connected', (name) => {
        this.viewers++
      })

      this.$socket.on('candidate', (id, candidate) => {
        candidate.usernameFragment = null
        peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate))
      })

      this.$socket.on('disconnectPeer', (id) => {
        peerConnections[id].close()
        delete peerConnections[id]
        this.viewers--
      })
    } else {
      this.viewers++
      let peer
      let counter = 0

      if (this.$socket.disconnected) {
        await this.$socket.connect()
      }
      await this.$socket.emit('join-room', this.$route.params.id, this.$auth.user.userName)
      await this.$socket.emit('chat-message', `${this.$auth.user.userName} has joined the room`)
      await this.$socket.emit('watcher')

      this.$socket.on('offer', (streamerId, description) => {
        if (counter === 0) {
          counter++
          peer = createViewerPeer()
          const socket = this.$socket

          handleAnswer(peer, streamerId, description, socket)

          peer.ontrack = (e) => {
            handleTrackEvent(e)
          }
          peer.onicecandidate = (e) => {
            if (e.candidate) {
              this.$socket.emit('candidate', streamerId, e.candidate)
            }
          }
        }
      })

      function createViewerPeer () {
        const peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: 'stun:stun.l.google.com:19302'
            }
          ]
        })
        return peer
      }

      async function handleAnswer (peer, streamerId, description, socket) {
        await peer.setRemoteDescription(description)
        const answer = await peer.createAnswer()

        await peer.setLocalDescription(answer)

        socket.emit('answer', streamerId, peer.localDescription)
      }

      function handleTrackEvent (e) {
        document.getElementById('video').srcObject = e.streams[0]
      }

      this.$socket.on('candidate', (id, candidate) => {
        candidate.usernameFragment = null
        peer
          .addIceCandidate(new RTCIceCandidate(candidate))
          .catch(e => console.error(e))
      })

      this.$socket.on('broadcaster', () => {
        this.$socket.emit('watcher')
      })
    }
  },
  async beforeDestroy () {
    await this.$socket.emit('chat-message', `${this.$auth.user.userName} has left the room`)
    this.$socket.close()
    if (this.streamerRole) {
      await this.$store.dispatch('stopStream')
    }
  },
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
.bigCinema {
  z-index: 50;
  margin-top: 5px;
  height: calc(82vh - 75px);
  width: 100%;
  background-color: #7f828b  31;
}
.bottom-bar {
  position: absolute;
  bottom: 25px;
  width: 100%;
  text-align: center;
}
#screen {
  height: 75vh;
}
.chat-img {
border-radius: 50%;
width: 40px;
height: 40px;
margin-right: 10px;
}
.dialog {
display: flex;
padding: 4px 0 0 6px;

// align-items: center;
// justify-content: center;
}
#messages > li:nth-child(odd) {
  background: rgba(195, 194, 194, 0.236);
}
li > p {
  margin-left: 10px !important;
  margin-bottom: 0px !important;
}
</style>
