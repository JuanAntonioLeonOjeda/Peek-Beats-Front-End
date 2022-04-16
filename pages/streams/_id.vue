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

                <div v-if="streamerRole">
                  <video class="bigCinema" ref="localVideo" autoplay muted>LocalVideo</video>
                  <video class="remoteVideo" ref="remoteVideo" autoplay muted>RemoteVideo</video>
                </div>
                <div v-else>
                  <video class="bigCinema" ref="remoteVideo" autoplay>RemoteVideo</video>
                  <video class="remoteVideo" ref="localVideo" autoplay muted>LocalVideo</video>
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
  async beforeMount () {
    const lastId = localStorage.getItem('lastId')
    if (lastId) {
      await this.$socket.emit('leave', this.room)
    }
    await this.$socket.emit('join', lastId)
    localStorage.setItem('lastId', this.room)
  },
  async mounted () {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    this.$refs.localVideo.srcObject = stream
    this.$store.commit('setting/setCamera', {
      camera: stream
    })
    stream.getTracks().forEach((track) => {
      localPC.addTrack(track, stream)
    })
    const offer = await localPC.createOffer()
    await localPC.setLocalDescription(offer)
    await this.$socket.emit('message', JSON.stringify({
      room: this.room,
      data: localPC.localDescription
    }))
    localPC.onicecandidate = async (event) => {
      if (event.candidate) {
        await this.$socket.emit('message', JSON.stringify({
          room: this.room,
          data: event.candidate
        }))
      } else {
        // eslint-disable-next-line
        console.log('allhasbeensent')
      }
    }
    localPC.ontrack = (event) => {
      if (event.streams[0]) {
        this.$refs.remoteVideo.srcObject = event.streams[0]
      }
    }
    this.$socket.on('message', async (data) => {
      if (data.type === 'offer') {
        await localPC.setRemoteDescription(new RTCSessionDescription(data))
        const answer = await localPC.createAnswer()
        await localPC.setLocalDescription(answer)
        await this.$socket.emit('message', JSON.stringify({
          room: this.room,
          data: localPC.localDescription
        }))
      } else if (data.type === 'answer') {
        await localPC.setRemoteDescription(new RTCSessionDescription(data))
      } else {
        await localPC.addIceCandidate(new RTCIceCandidate(data))
      }
    })
  },
  async beforeDestroy () {
    await this.$socket.emit('leave', this.room)
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
