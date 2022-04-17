<template>
  <div>
    <v-col cols="12" md="12">
      <v-card-text>
        <div>
          <h1>
            <p>
              Create an account
            </p>
          </h1>
          <v-divider class="mt-3 mb-4" dark />
        </div>

        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="username"
            :light="$vuetify.theme.dark === true"
            color="$vuetify.theme.light"
            outlined
            :counter="10"
            :rules="usernameRules"
            label="Username"
            prepend-inner-icon="mdi-form-textbox"
            required
            autocomplete="username"
          />
          <v-text-field
            v-model="email"
            :light="$vuetify.theme.dark === true"
            color="$vuetify.theme.light"
            outlined
            :rules="emailRules"
            label="E-mail"
            prepend-inner-icon="mdi-at"
            required
            autocomplete="email"
          />
          <v-alert
            :class="{ alert: alert, 'text-danger': hasError }"
            border="top"
            color="pink darken-1"
            dark
          >
            <v-spacer />
            <v-col class="shrink">
              <v-btn
                class="text-center"
                color="white"
                outlined
                block
                @click="hasError=true"
              >
                Email already in use.
              </v-btn>
            </v-col>
          </v-alert>
          <v-text-field
            v-model="pass1"
            :light="$vuetify.theme.dark === true"
            color="$vuetify.theme.light"
            hint="At least 8 characters"
            counter
            :rules="passwordRules"
            outlined
            :type="passVisible ? 'text' : 'password'"
            label="Password"
            prepend-inner-icon="mdi-onepassword"
            :append-icon="
              passVisible
                ? 'mdi-eye-outline'
                : 'mdi-eye-off-outline'
            "
            autocomplete="new-password"
            @click:append="passVisible = !passVisible"
          />
          <v-text-field
            v-model="pass2"
            :light="$vuetify.theme.dark === true"
            color="$vuetify.theme.light"
            hint="At least 8 characters"
            counter
            :rules="passwordRules.concat(passwordConfirmationRule)"
            outlined
            :type="passVisible1 ? 'text' : 'password'"
            label="Confirm password"
            prepend-inner-icon="mdi-onepassword"
            :append-icon="
              passVisible1
                ? 'mdi-eye-outline'
                : 'mdi-eye-off-outline'
            "
            autocomplete="new-password"
            @click:append="passVisible1 = !passVisible1"
          />
          <v-row>
            <v-col cols="6" sm="6" md="6">
              <v-dialog
                ref="dialog"
                v-model="modal"
                :return-value.sync="date"
                persistent
                width="290px"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    :light="$vuetify.theme.dark === true"
                    color="$vuetify.theme.light"
                    label="Birthday"
                    prepend-icon="mdi-cake-variant-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker v-model="date" scrollable>
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    @click="modal = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog.save(date)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              sm="7"
              md="7"
            >
              <v-checkbox
                v-model="checkbox"
                :light="$vuetify.theme.dark === true"
                color="$vuetify.theme.light"
                :rules="[
                  (v) =>
                    !!v ||
                    'You must agree the Terms and Conditions to continue!',
                ]"
                label="Terms and Conditions"
                required
              />
            </v-col>
            <v-col
              cols="12"
              sm="5"
              md="5"
            >
              <v-checkbox
                :light="$vuetify.theme.dark === true"
                color="$vuetify.theme.light"
                label="Mailing List"
                required
              />
            </v-col>
          </v-row>
          <v-divider class="mb-5" dark />
          <div>
            <h3>
              <p>
                Already have an account?
                <a
                  class="sign text-decoration-none"
                  @click="stepChanger"
                > LOG IN </a>
              </p>
            </h3>
          </div>
          <div class="text-center mt-5">
            <v-btn
              :disabled="!valid"
              class="mt-5"
              color="#565EE8"
              outlined
              x-large
              block
              @click="validate(); signup()"
            >
              SignUp
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-col>
  </div>
</template>

<script>

export default {
  name: 'SignupForm',
  props: {
  },
  data: () => ({
    valid: false,
    username: '',
    usernameRules: [
      v => !!v || 'Username is required',
      v => (v && v.length <= 10) || 'Username must be less than 10 characters'
    ],

    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],

    pass1: '',
    pass2: '',
    passwordRules: [
      v => !!v || 'Required.',
      v => v.length >= 8 || 'Min 8 characters'
    ],

    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),

    checkbox: false,
    menu: false,
    modal: false,
    menu2: false,
    passVisible: false,
    passVisible1: false,
    alert: true,
    hasError: true
  }),
  computed: {
    passwordConfirmationRule () {
      return () => this.pass1 === this.pass2 || 'Password must match'
    }
  },

  methods: {
    stepChanger () {
      this.$store.commit('stepChanger', 1)
    },
    validate () {
      this.$refs.form.validate()
    },
    async login () {
      await this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.pass1
        }
      })
      this.$router.push({ path: '/home' })
    },
    async signup () {
      try {
        const form = {
          userName: this.username,
          email: this.email,
          password: this.pass1,
          dateOfBirth: this.date
        }
        await this.$store.dispatch('signup', form)
        this.login()
      } catch (error) {
        this.hasError = false
      }
    }
  }
}
</script>

<style scoped>
.text-danger {
  display: none;
}
h1 {
  color: #565EE8;
}
.sign {
  color: #565EE8;
}
h3 {
  color: #353A3D;
}
</style>
