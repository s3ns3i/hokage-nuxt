<template>
  <v-container
    fluid
    class="fill-height"
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="5"
      >
        <v-card class="elevation-12">
          <v-toolbar
            color="primary"
            dark
          >
            <v-toolbar-title>hokage</v-toolbar-title>
            <v-spacer />
            <v-btn
              class="ml-6"
              icon
              @click="onThemeChange"
            >
              <v-icon>mdi-theme-light-dark</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-text-field
                v-model="clone.email"
                :rules="emailRules"
                label="E-mail"
                type="email"
                @keyup.enter="onLogin"
              />
              <v-text-field
                v-model="clone.password"
                :rules="passwordRules"
                label="Password"
                type="password"
                @keyup.enter="onLogin"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              :disabled="!valid"
              @click="onLogin"
            >
              Login
            </v-btn>
          </v-card-actions>
          <v-snackbar
            v-model="snackbar"
            color="error"
            :timeout="3000"
            bottom
            absolute
          >
            {{ "Zły e-mail lub hasło!" }}
            <v-btn
              dark
              text
              @click="snackbar = false"
            >
              Zamknij
            </v-btn>
          </v-snackbar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Login",
  layout: "login",
  data() {
    return {
      user: null,
      clone: null,
      valid: false,
      emailRules: [
        v => !!v || "E-mail jest wymagany!",
        v => /.+@.+\..+/.test(v) || "E-mail jest wymagany!"
      ],
      passwordRules: [v => !!v || "Hasło jest wymagane!"],
      snackbar: false
    };
  },
  computed: {
    usersParams() {
      return {
        query: {},
        paginate: false
      };
    }
  },
  created() {
    const { User } = this.$FeathersVuex.api;
    this.user = new User({});
    this.clone = this.user.clone();
  },
  methods: {
    async onLogin() {
      if (this.valid) {
        try {
          await this.$store.dispatch("auth/authenticate", {
            strategy: "local",
            email: this.clone.email,
            password: this.clone.password
          });
          this.$router.push("/translations");
        } catch (error) {
          if(error.code === 401) {
            this.snackbar = true;
            this.clone.password = '';
            this.$refs.form.resetValidation();
          } else {
            console.error(error);
          }
        }
      }
    },
    onThemeChange() {
      const isDarkTheme = !this.$vuetify.theme.dark;
      this.$vuetify.theme.dark = isDarkTheme;
      localStorage.setItem('hokage_theme_dark', isDarkTheme);
    },
  }
};
</script>
