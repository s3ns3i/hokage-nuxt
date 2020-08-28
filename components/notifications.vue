<template>
  <div>
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
        <v-list-item
          v-for="(notification, index) in notifications"
          :key="index"
        >
          <v-list-item-title>{{ notification.text }}</v-list-item-title>
          <v-list-item-subtitle v-if="notification.link" />
          <v-btn icon @click="onNotificationClose(notification.id)">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
    <audio ref="audio">
      <source src="@/static/notification.wav" type="audio/mpeg" />
    </audio>
  </div>
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
      const user = this.$store.getters["auth/user"];
      if (user) {
        return this.findNotificationsInStore({
          query: { userId: user.id }
        }).data;
      } else {
        console.error("User is not authorized!");
        return [];
      }
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
  created() {
    this.$FeathersVuex.api.Notification.on(
      "created",
      this.handleNotificationCreated
    );
  },
  destroyed() {
    this.$FeathersVuex.api.Notification.off(
      "created",
      this.handleNotificationCreated
    );
  },
  methods: {
    onNotificationClose(id) {
      this.$store.dispatch("notification/remove", id);
    },
    async handleNotificationCreated(notification) {
      const userId = this.$store.getters["auth/user"].id;
      const newNotificationUserId = notification.userId;
      if (userId === newNotificationUserId) {
        const audio = this.$refs.audio;
        audio.play();

        audio.addEventListener("canplaythrough", () => {
          audio.play();
        });
      }
    }
  }
};
</script>

<style></style>
