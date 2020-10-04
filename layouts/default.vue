<template>
  <v-app id="hokage_app">
    <navigation-drawer />
    <top-menu />
    <v-content>
      <nuxt />
    </v-content>
    <v-snackbar
      :value="snackbar"
      :timeout="3000"
      color="error"
      bottom
      @input="onSnackbarClose"
    >
      {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="onSnackbarClose(false)">
          Zamknij
        </v-btn>
      </template>
    </v-snackbar>
    <v-footer app inset>
      Aplikacja Hokage wykonana przez s3ns3i (2020)
    </v-footer>
  </v-app>
</template>
<script>
import NavigationDrawer from "@/components/navigation-drawer.vue";
import TopMenu from "@/components/top-menu.vue";

export default {
  name: "DefaultLayout",
  components: {
    NavigationDrawer,
    TopMenu
  },
  layout: "default",
  data() {
    return {
      user: this.$store.getters["auth/user"],
      snackbar: false
    };
  },
  computed: {
    roleIds() {
      return this.user.roles.map(role => role.id);
    },
    projectIds() {
      return this.user.user_project_roles.map(userProjectRole => {
        return userProjectRole.project_role.projectId;
      });
    },
    isTaskPatchPending() {
      return this.$store.state.task.isPatchPending;
    },
    errorMessage() {
      return this.$store.getters["error-handler/getErrorMessage"];
    }
  },
  watch: {
    isTaskPatchPending(value) {
      if (!value) {
        this.fetchTasks();
      }
    },
    errorMessage(value) {
      if (value) {
        this.snackbar = true;
      }
    }
  },
  mounted() {
    if (this.user) {
      this.$store.dispatch("notification/find", {
        query: { userId: this.user.id }
      });
      this.$store.dispatch("task/find", { query: {} });
      this.$store.dispatch("role/find", { query: {} });
      this.$store.dispatch("user/find", { query: {} });
      this.$store.dispatch("project/find", { query: {} });
    } else {
      console.log("User is not authorized!");
    }
    if (this.errorMessage) {
      this.snackbar = true;
    }
  },
  methods: {
    fetchTasks() {
      this.$store.dispatch("task/find", {
        query: {
          projectId: { $in: this.projectIds },
          $sort: {
            projectId: 1,
            chapterNo: 1
          }
        }
      });
    },
    onSnackbarClose(event) {
      this.snackbar = event;
      this.$store.dispatch("error-handler/removeErrorMessage");
    }
  }
};
</script>
