<template>
  <v-card v-if="$vuetify.breakpoint.lgOnly || $vuetify.breakpoint.xlOnly" id="chat" flat color="mainCards">
    <ul id="messages" />
    <!-- :style="[$vuetify.theme.dark === true ? {'background-color': '#3e454a'} : {'background-color': '#dddddd'}]" -->
    <v-form id="form">
      <!-- <input id="input" autocomplete="off"> -->
      <v-text-field v-model="text" class="ml-2" placeholder="Send a message" outlined dense />
      <v-btn class="mr-2 pa-5 white--text" color="#565EE8" @click="submit">
        Send
      </v-btn>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'StreamChat',
  data () {
    return {
      avatar: this.$auth.user.avatar,
      userName: this.$auth.user.userName,
      text: ''
    }
  },
  mounted () {
    // const form = document.getElementById('form')
    // const input = document.getElementById('input')
    const messages = document.getElementById('messages')

    // form.addEventListener('submit', (e) => {
    //   e.preventDefault()
    //   if (this.text) {
    //     this.$socket.emit('chat-message', `<p class="dialog" style="font-weight: bold"> <img class="chat-img" src="${this.avatar}"> ${this.userName} said: </p> <p>${this.text}</p>`)
    //     this.text = ''
    //   }
    // })

    this.$socket.on('chat-message', (message) => {
      const text = document.createElement('li')
      text.innerHTML = `${message}`
      messages.appendChild(text)
      window.scrollTo(0, document.body.scrollHeight)
    })
  },
  methods: {
    go () {
      return this.submit()
    },
    submit () {
      if (this.text) {
        this.$socket.emit('chat-message', `<p class="dialog" style="font-weight: bold"> <img class="chat-img" src="${this.avatar}"> ${this.userName} said: </p> <p>${this.text}</p>`)
        this.text = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#chat {
  height: 75vh;
  // overflow: scroll;
  // overflow-x: hidden;
}
#form {
  position: absolute;
  bottom: -10px;
  margin-bottom: 10px;
  display:flex;
  height: 3.2rem;
  // box-sizing: border-box;
  // color: #dddddd;
  // backdrop-filter: blur(10px);
  width: 100%;
}
// #input {
//   z-index: 10123;
//   border-radius: 2rem;
//   margin: 0.25rem;
//   color: white;
// }
// #input:focus {
//   outline: none;
// }
// #form > button {
//   border: none;
//   padding: 0 1rem;
//   margin: 0.25rem;
//   border-radius: 3px;
//   outline: none;
// }
#messages {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
</style>
