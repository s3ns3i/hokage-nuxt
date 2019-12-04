<template>
  <v-col>
    <v-row>
      <h1>hokage</h1>
    </v-row>
    <v-row>
      <h2>
        This is the first launch of the application. You need to set an admin
        password to continue.
      </h2>
    </v-row>
    <v-row>
      <v-form>
        <v-text-field v-model="clone.email" label="E-mail" type="email" />
        <v-text-field v-model="clone.nickname" label="Nickname" type="text" />
        <v-text-field
          v-model="clone.password"
          label="Password"
          type="password"
        />
        <v-text-field
          v-model="clone.confirmPassword"
          label="Confirm password"
          type="password"
        />
        <v-btn @click="createUser">Create admin account</v-btn>
      </v-form>
    </v-row>
  </v-col>
</template>

<script>
import { makeFindMixin } from "feathers-vuex";

export default {
  name: "FirstUser",
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
    async createUser() {
      try {
        const user = await this.clone.save();
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>