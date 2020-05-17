<template>
  <v-container>
    <users-projects />
    <users-by-roles />
  </v-container>
</template>

<script>
import UsersProjects from "@/components/dashboard/users-projects.vue";
import UsersByRoles from "@/components/dashboard/users-by-roles.vue";

export default {
  name: "Dashboard",
  components: {
    UsersProjects,
    UsersByRoles
  }
};
</script>
