<template>
  <v-menu
    v-model="menu"
    left
    offset-y
    close-on-click
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <v-btn icon :disabled="!notifications.length" v-on="on">
        <v-badge
          :value="notifications.length"
          :content="notifications.length"
          color="error"
          overlap
          bottom
          left
        >
          <v-icon>{{ notificationIcon }}</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(notification, index) in notifications" :key="index">
        <v-list-item-title>{{ notification.text }}</v-list-item-title>
        <v-list-item-subtitle v-if="notification.link" />
        <v-btn icon @click="onNotificationClose(notification.id)">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Notifications",
  data() {
    return {
      menu: false
    };
  },
  computed: {
    ...mapGetters("notification", { findNotificationsInStore: "find" }),
    notifications() {
      return this.findNotificationsInStore({
        query: { userId: this.$store.getters["auth/user"].id }
      }).data;
    },
    notificationIcon() {
      return this.notifications.length ? "mdi-bell-ring" : "mdi-bell";
    }
  },
  watch: {
    notifications() {
      if (!this.notifications.length) {
        this.menu = false;
      }
    }
  },
  methods: {
    onNotificationClose(id) {
      this.$store.dispatch("notification/remove", id);
    }
  }
};
</script>

<style></style>
