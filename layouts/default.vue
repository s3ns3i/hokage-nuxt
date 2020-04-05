<template>
  <v-app id="hokage_app">
    <navigation-drawer />
    <v-app-bar app>
      <v-toolbar-title>hokage</v-toolbar-title>
      <v-spacer />
      <v-btn icon :disabled="isTaskInProgress" @click="onLogout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <nuxt />
    </v-content>
    <v-footer app inset>Hokage app made by s3ns3i (2020)</v-footer>
  </v-app>
</template>
<script>
import { mapGetters } from "vuex";
import NavigationDrawer from "@/components/navigation-drawer.vue";

export default {
  name: "DefaultLayout",
  layout: "default",
  components: {
    NavigationDrawer
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({ isTaskInProgress: "getIsTaskInProgress" })
  },
  methods: {
    async onLogout() {
      try {
        await this.$store.dispatch("auth/logout");
        this.$router.push("/login");
      } catch (error) {
        console.error(error);
      }
    }
  },
  async beforeCreate() {
    if (!this.$store.state.auth.user) {
      await this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    }
  },
  created() {
    this.$store.dispatch("user/find", { query: {} });
    this.$store.dispatch("role/find", { query: {} });
  }
};
</script>