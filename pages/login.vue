<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="5">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark>
            <v-toolbar-title>hokage</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field v-model="clone.email" label="E-mail" type="email" />
              <v-text-field
                v-model="clone.password"
                label="Password"
                type="password"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="onLogin">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { makeFindMixin } from "feathers-vuex";

export default {
  name: "Login",
  layout: "login",
  mixins: [makeFindMixin({ service: "users", watch: true })],
  data() {
    return {
      user: null,
      clone: null
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
      try {
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
};
</script>