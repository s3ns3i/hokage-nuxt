<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-dialog v-model="dialog" persistent max-width="600">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" @click="dialog = true" v-on="on">
              Dodaj projekt
            </v-btn>
          </template>
          <projects-modal v-if="dialog" @close="dialog = false" />
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
              {{
                projects
              }}
            </thead>
            <tbody>
              <tr v-for="project in projects" :key="project.name">
                <td>{{ project.name }}</td>
                <td>{{ project.volumesNo }}</td>
                <td>{{ project.suspended }}</td>
                <td>
                  <v-chip v-for="user in project.users" :key="user.email">
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
import { mapState, mapGetters, mapActions } from "vuex";
import ProjectsModal from "@/components/projects-modal.vue";

export default {
  name: "Projects",
  components: { ProjectsModal },
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    ...mapState("user", { isLoading: "isFindPending" }),
    ...mapGetters("project", { findProjectsInStore: "find" }),
    ...mapGetters("user", { findUsersInStore: "find" }),
    ...mapGetters("role", { findRolesInStore: "find" }),
    projects() {
      return this.findProjectsInStore({ query: {} }).data;
    },
    users() {
      return this.findUsersInStore({ query: {} }).data;
    },
    roles() {
      return this.findRolesInStore({ query: { id: { $ne: 1 } } }).data;
    }
  }
};
</script>