<template>
  <v-app id="hokage_app">
    <navigation-drawer />
    <top-menu />
    <v-content>
      <nuxt />
    </v-content>
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
      user: this.$store.getters["auth/user"]
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
    }
  },
  watch: {
    isTaskPatchPending(value) {
      if (!value) {
        this.fetchTasks();
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
  },
  methods: {
    fetchTasks() {
      // this.$store.commit("task/clearAll");
      this.$store.dispatch("task/find", {
        query: {
          roleId: { $in: this.roleIds },
          projectId: { $in: this.projectIds },
          $or: [{ userId: this.user.id }, { userId: null }],
          $sort: {
            projectId: 1,
            chapterNo: 1
          }
        }
      });
    }
  }
};
</script>
