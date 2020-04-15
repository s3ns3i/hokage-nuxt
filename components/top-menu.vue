<template>
  <v-app-bar app>
    <v-toolbar-title>hokage</v-toolbar-title>
    <v-spacer />
    <notifications />
    <v-btn class="ml-6" icon :disabled="isTaskInProgress" @click="onLogout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";
import Notifications from "@/components/notifications.vue";

export default {
  name: "TopMenu",
  components: { Notifications },
  computed: {
    ...mapGetters({ isTaskInProgress: "getIsTaskInProgress" })
  },
  methods: {
    async onLogout() {
      try {
        await this.$store.dispatch("auth/logout");
        this.$router.go("/login");
      } catch (error) {
        console.error(error);
        this.$router.go("/login");
      }
    }
  }
};
</script>

<style>
</style>