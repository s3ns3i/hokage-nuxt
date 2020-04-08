<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-dialog v-model="dialog" persistent max-width="600">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" @click="dialog = true" v-on="on">
              Dodaj użytkownika
            </v-btn>
          </template>
          <users-modal @close="dialog = false" />
        </v-dialog>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Ksywka</th>
                <th class="text-left">E-mail</th>
                <th class="text-left">Projekty</th>
                <th class="text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.email">
                <td>{{ user.nickname }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <v-chip
                    v-for="(project, index) in assignedProjects(user)"
                    :key="index"
                  >
                    {{ project }}
                  </v-chip>
                </td>
                <td>
                  <v-chip v-for="role in user.roles" :key="role.id">
                    {{ role.name }}
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
import UsersModal from "@/components/users-modal.vue";

export default {
  name: "Users",
  components: { UsersModal },
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    ...mapState("user", { isLoading: "isFindPending" }),
    ...mapGetters("user", { findUsersInStore: "find" }),
    users() {
      return this.findUsersInStore({ query: {} }).data;
    }
  },
  created() {
    this.$store.dispatch("user/find", { query: {} });
  },
  methods: {
    assignedProjects(user) {
      if (user.user_project_roles) {
        return user.user_project_roles.map(
          userProjectRole => userProjectRole.project_role.project.name
        );
      } else {
        return [];
      }
    }
  }
};
</script>