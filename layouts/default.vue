<template>
  <v-app id="hokage_app">
    <navigation-drawer />
    <top-menu />
    <v-content>
      <nuxt />
    </v-content>
    <v-footer app inset>
      Hokage app made by s3ns3i (2020)
    </v-footer>
  </v-app>
</template>
<script>
import NavigationDrawer from "@/components/navigation-drawer.vue";
import TopMenu from "@/components/top-menu.vue";

export default {
  name: "DefaultLayout",
  layout: "default",
  components: {
    NavigationDrawer,
    TopMenu
  },
  mounted() {
    this.$store.dispatch("task/find", { query: {} });
    this.$store.dispatch("role/find", { query: {} });
    this.$store.dispatch("user/find", { query: {} });
    this.$store.dispatch("project/find", { query: {} });
    const user = this.$store.getters["auth/user"];
    if (user) {
      this.$store.dispatch("notification/find", {
        query: { userId: user.id }
      });
    } else {
      console.log("User is not authorized!");
    }
  }
};
</script>
