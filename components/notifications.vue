<template>
  <v-menu
    v-model="menu"
    left
    offset-y
    close-on-click
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        :disabled="!notifications.length"
        v-on="on"
      >
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
      <v-list-item
        v-for="(notification, index) in notifications"
        :key="index"
        link
        @click="onNotificationClick(index, notification.link)"
      >
        <v-list-item-title>{{ notification.text }}</v-list-item-title>
        <v-list-item-subtitle v-if="notification.link" />
        <v-btn
          icon
          @click="onNotificationClose(index)"
        >
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "Notifications",
  data() {
    return {
      menu: false,
      notifications: [
        {
          text: "Hehe",
          link: "/translations/1"
        },
        {
          text: "Hehe2"
        },
        {
          text: "Hehe3"
        }
      ]
    };
  },
  computed: {
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
    onNotificationClick(index, link) {
      if (link) {
        this.menu = false;
        this.onNotificationClose(index);
        this.$router.push(link);
      }
    },
    onNotificationClose(index) {
      this.notifications.splice(index, 1);
    }
  }
};
</script>

<style>
</style>