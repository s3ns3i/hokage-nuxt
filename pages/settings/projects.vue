<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-dialog v-model="dialog" persistent max-width="600">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" @click="onDialogOpen()" v-on="on">
              Dodaj projekt
            </v-btn>
          </template>
          <projects-modal
            v-if="dialog"
            :project="project"
            @close="onDialogClose()"
          />
        </v-dialog>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Nazwa projektu</th>
                <th class="text-left">Liczba tomów</th>
                <th class="text-left">Zawieszony?</th>
                <th v-for="role in roles" :key="role.id" class="text-left">
                  {{ role.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="project in projects"
                class="table-row"
                :key="project.name"
                @click="onDialogOpen(project)"
              >
                <td>{{ project.name }}</td>
                <td>{{ project.volumesNo }}</td>
                <td>{{ project.suspended ? "Tak" : "Nie" }}</td>
                <td v-for="role in roles" :key="role.id">
                  <v-chip
                    v-for="user in getUsersByProjectRole(project, role)"
                    :key="user.email"
                  >
                    {{ user.nickname }}
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import ProjectsModal from "@/components/projects-modal.vue";

export default {
  name: "Projects",
  components: { ProjectsModal },
  data() {
    return {
      dialog: false,
      project: null
    };
  },
  computed: {
    ...mapGetters("project", { findProjectsInStore: "find" }),
    ...mapGetters("role", { findRolesInStore: "find" }),
    projects() {
      return this.findProjectsInStore({ query: {} }).data;
    },
    roles() {
      return this.findRolesInStore({ query: { id: { $ne: 1 } } }).data;
    }
  },
  methods: {
    getUsersByProjectRole(project, role) {
      return project.project_roles.find(
        projectRole => projectRole.roleId === role.id
      ).users;
    },
    onDialogOpen(project) {
      this.project = project;
      this.dialog = true;
    },
    onDialogClose() {
      this.project = null;
      this.dialog = false;
    }
  }
};
</script>