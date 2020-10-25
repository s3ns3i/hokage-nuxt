<template>
  <v-container>
    <v-row>
      <v-col>
        <projects />
      </v-col>
    </v-row>
    <v-row>
      <projects-by-user-container />
    </v-row>
    <v-row>
      <v-col md="12" lg="6">
        <users-projects />
      </v-col>
      <v-col md="12" lg="6">
        <chapters-by-week />
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="12">
        <users-by-roles />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Projects from "@/components/dashboard/projects.vue";
import ProjectsByUserContainer from "@/components/dashboard/projects-by-user/container.vue";
import UsersProjects from "@/components/dashboard/users-projects.vue";
import UsersByRoles from "@/components/dashboard/users-by-roles.vue";
import ChaptersByWeek from "@/components/dashboard/chapters-by-week.vue";

export default {
  name: "Dashboard",
  components: {
    Projects,
    ProjectsByUserContainer,
    UsersProjects,
    UsersByRoles,
    ChaptersByWeek
  }
};
</script>
