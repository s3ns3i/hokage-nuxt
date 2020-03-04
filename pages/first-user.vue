<template>
  <v-app if="hokage_first-user">
    <v-content>
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="5">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark>
                <v-toolbar-title>hokage</v-toolbar-title>
              </v-toolbar>
              <v-card-title>
                This is the first launch of the application. You need to set an
                admin password to continue.
              </v-card-title>
              <v-card-text>
                <v-form v-model="valid">
                  <v-text-field
                    v-model="clone.email"
                    :rules="emailRules"
                    label="E-mail"
                    type="email"
                    required
                  />
                  <v-text-field
                    v-model="clone.nickname"
                    label="Ksywka"
                    type="text"
                    required
                  />
                  <v-text-field
                    v-model="clone.password"
                    :rules="[v => !!v || 'Hasło jest wymagane!']"
                    label="Hasło"
                    type="password"
                    required
                  />
                  <v-text-field
                    v-model="clone.confirmPassword"
                    label="Potwierdź hasło"
                    type="password"
                    required
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" :disabled="!valid" @click="createUser"
                  >Utwórz konto administratora</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { makeFindMixin } from "feathers-vuex";

export default {
  name: "FirstUser",
  layout: "login",
  mixins: [makeFindMixin({ service: "users", watch: true })],
  data() {
    return {
      user: null,
      clone: null,
      valid: false,
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ]
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
    const FirstUser = this.$FeathersVuex.api.byServicePath["users/first-user"];
    this.user = new FirstUser({});
    this.clone = this.user.clone();
  },
  methods: {
    async createUser() {
      if (this.valid) {
        try {
          const user = await this.clone.save();
          await this.$store.dispatch("auth/authenticate", {
            strategy: "local",
            email: this.clone.email,
            password: this.clone.password
          });
          this.$router.push("/");
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
};
</script>