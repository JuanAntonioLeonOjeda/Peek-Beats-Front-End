<template>
  <v-card v-if="$vuetify.breakpoint.lgOnly || $vuetify.breakpoint.xlOnly" id="chat" flat overflow="scroll">
    <ul id="messages" overflow="scroll" />
    <form id="form">
      <input id="input" autocomplete="off"><v-btn color="accent">Send</v-btn>
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
        this.$socket.emit('chat-message', `<p class="dialog" style="font-weight: bold"> <img class="chat-img" src="${this.avatar}"> ${this.userName} said: </p> <p>${input.value}</p>`)
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
  width: 17vw;
  height: 78vh;
  position: absolute;
  right: 0;
}
#form {
  background: rgba(44, 51, 156, 0.355);
  display:flex;
  height: 3rem;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  position: absolute;
  bottom: 0;
  width: 100%;
}
#input {
  border-radius: 2rem;
  margin: 0.25rem;
  width: 75%
}
#input:focus {
  outline: none;
}
#form > button {
  border: none;
  padding: 0 1rem;
  margin: 0.25rem;
  border-radius: 3px;
  outline: none;
}
#messages {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
</style>
