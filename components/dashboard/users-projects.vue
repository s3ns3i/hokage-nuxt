<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>
          Użytkownicy
          <v-spacer />
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Wyszukaj"
            single-line
          />
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="5"
          :search="search"
        >
          <template v-slot:item.latestTask="{ item }">
            <div v-if="item.latestTask">
              {{ new Date(item.latestTask).toLocaleDateString() }}
            </div>
            <div v-else>Brak aktywności</div>
          </template>
          <template v-slot:item.roles="{ item }">
            <v-chip v-for="role in item.roles" :key="role.id">
              {{ role.name }}
            </v-chip>
          </template>
          <template v-slot:item.projects="{ item }">
            <v-chip v-for="project in item.projects" :key="project.id">
              {{ project }}
            </v-chip>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "UsersProjects",
  data() {
    return {
      search: "",
      headers: [
        { text: "Ksywka", value: "nickname" },
        { text: "Ostatnia aktywność", value: "latestTask" },
        { text: "Role", value: "roles", sortable: false },
        { text: "Projekty", value: "projects", sortable: false }
      ]
    };
  },
  computed: {
    items() {
      return this.$store.getters["users-projects/find"]({
        query: {}
      }).data.map(user => ({
        id: user.id,
        nickname: user.nickname,
        latestTask: user.latestTask,
        roles: user.roles,
        projects: user.projects
      }));
    }
  },
  beforeMount() {
    this.$store.dispatch("users-projects/find", { query: {} });
  }
  // methods: {
  //   assignedProjects(user) {
  //     if (user.user_project_roles) {
  //       return user.user_project_roles.map(
  //         userProjectRole => userProjectRole.project_role.project.name
  //       );
  //     } else {
  //       return [];
  //     }
  //   }
  // }
};
</script>

<style></style>
