<template>
  <v-card>
    <v-card-title>
      Status projektów
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
      :items-per-page="10"
      :search="search"
    >
      <template v-slot:item.status="{ item }">
        <div v-if="item.status" class="red--text font-weight-bold">
          Zawieszony
        </div>
        <div v-else-if="isDelayed(item.latestTaskDate)" class="orange--text">
          Opóźniony
        </div>
        <div v-else>Ongoing</div>
      </template>
      <template v-slot:item.latestTask="{ item }">
        <div v-if="item.latestTask">
          {{ item.latestTask }}
        </div>
        <div v-else>Brak</div>
      </template>
      <template v-slot:item.latestTaskDate="{ item }">
        <div v-if="item.latestTaskDate">
          {{ new Date(item.latestTaskDate).toLocaleDateString() }}
        </div>
        <div v-else>Brak</div>
      </template>
      <template
        v-for="header in dynamicHeaders"
        v-slot:[header.code]="{ item }"
      >
        <v-chip v-for="user in item[header.value]" :key="user.value">
          {{ user.text }}
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "Projects",
  data() {
    return {
      search: ""
    };
  },
  computed: {
    headers() {
      let headers = [
        { text: "Project", value: "name" },
        { text: "Liczba rozdziałów", value: "taskNo" },
        { text: "Status", value: "status" },
        { text: "Ostatni rozdział", value: "latestTask" },
        { text: "Data wydania", value: "latestTaskDate" }
      ].concat(this.dynamicHeaders);

      return headers;
    },
    dynamicHeaders() {
      const dynamicHeaders = [];
      const roles = this.$store.getters["role/list"];
      roles.slice(1, roles.length).forEach(role => {
        dynamicHeaders.push({
          text: role.name,
          value: `role_${role.id}`,
          code: `item.role_${role.id}`,
          sortable: false
        });
      });
      return dynamicHeaders;
    },
    items() {
      const projects = this.$store.getters["project/list"];
      const mappedProjects = projects.map(project => {
        const mappedProject = {
          name: project.name,
          taskNo: project.tasks.length,
          status: project.suspended,
          latestTask: this.getLatestTaskName(project.tasks),
          latestTaskDate: this.getLatestTaskDate(project.tasks)
        };
        project.project_roles.forEach(projectRole => {
          mappedProject[`role_${projectRole.roleId}`] = projectRole.users.map(
            user => ({
              text: user.nickname,
              value: user.id
            })
          );
        });
        return mappedProject;
      });
      return mappedProjects;
    },
    isDelayed() {
      return latestTaskDate => {
        const interval = Date.now() - latestTaskDate;
        return interval > 1209600000;
      };
    }
  },
  methods: {
    getLatestTaskName(tasks) {
      const latestTask = [...tasks].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];
      if (latestTask) {
        return `Rozdział ${latestTask.chapterNo}: ${latestTask.name}`;
      }
      return "";
    },
    getLatestTaskDate(tasks) {
      const latestTask = [...tasks].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];
      if (latestTask) {
        return latestTask.updatedAt;
      }
      return "";
    }
  }
};
</script>
