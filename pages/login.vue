<template>
  <v-col>
    <v-row>
      <h1>hokage</h1>
    </v-row>
    <v-row>
      <h2>
        Hello, let's login, so we can start work!
      </h2>
    </v-row>
    <v-row>
      <v-form>
        <v-text-field v-model="clone.email" label="E-mail" type="email" />
        <v-text-field
          v-model="clone.password"
          label="Password"
          type="password"
        />
        <v-btn @click="onLogin">Login</v-btn>
      </v-form>
    </v-row>
  </v-col>
</template>

<script>
import { makeFindMixin } from "feathers-vuex";

export default {
  name: "Login",
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
        const payload = await this.$store.dispatch("auth/authenticate", {
          strategy: "local",
          email: this.clone.email,
          password: this.clone.password
        });
        console.debug(payload);
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>