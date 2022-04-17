<template>
  <v-card v-if="$vuetify.breakpoint.lgOnly || $vuetify.breakpoint.xlOnly" id="chat">
    <ul id="messages" />
    <form id="form">
      <input id="input" autocomplete="off"><button>Send</button>
    </form>
  </v-card>
</template>

<script>
export default {
  name: 'StreamChat',
  data () {
    return {
      avatar: this.$auth.user.avatar,
      userName: this.$auth.user.userName
    }
  },
  mounted () {
    const form = document.getElementById('form')
    const input = document.getElementById('input')
    const messages = document.getElementById('messages')

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      if (input.value) {
        this.$socket.emit('chat-message', `<p class="dialog"> <img class="chat-img" src="${this.avatar}"> ${this.userName} said: </p> <p>${input.value}</p>`)
        input.value = ''
      }
    })

    this.$socket.on('chat-message', (message) => {
      const text = document.createElement('li')
      text.innerHTML = `${message}`
      messages.appendChild(text)
      window.scrollTo(0, document.body.scrollHeight)
    })
  }
}
</script>

<style lang="scss" scoped>
#chat {
  width: 250px;
  height: 90vh;
  position: absolute;
  right: 0 +1vw;
}
#form {
  background: rgba(0, 0, 0, 0.15);
  display:flex;
  height: 3rem;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  position: absolute;
  bottom: 0;
}
#input {
  border-radius: 2rem;
  margin: 0.25rem;
}
#input:focus {
  outline: none;
}
#form > button {
  background: #333;
  border: none;
  padding: 0 1rem;
  margin: 0.25rem;
  border-radius: 3px;
  outline: none;
  color: #fff;
}
#messages {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
</style>
