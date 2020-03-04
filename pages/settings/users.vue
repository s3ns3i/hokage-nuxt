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
                <td>{{ user.projectsNo }}</td>
                <td>
                  <v-chip v-for="role in user.roles" :key="role.code">
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
    ...mapState("users", { isLoading: "isFindPending" }),
    ...mapGetters("users", { findUsersInStore: "find" }),
    query() {
      return {};
    },
    users() {
      return this.findUsersInStore({ query: this.query }).data;
    }
  },
  methods: { ...mapActions("users", { findUsers: "find" }) },
  mounted() {}
};
</script>