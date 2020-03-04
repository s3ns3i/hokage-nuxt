<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-dialog v-model="dialog" persistent max-width="600">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" @click="dialog = true" v-on="on">
              Dodaj rolę
            </v-btn>
          </template>
          <roles-modal @close="dialog = false" />
        </v-dialog>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Kod</th>
                <th class="text-left">Nazwa</th>
                <th class="text-left">Użytkownicy o tej roli</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="role in roles" :key="role.code">
                <td>{{ role.code }}</td>
                <td>{{ role.name }}</td>
                <td>
                  <v-chip v-for="user in role.users" :key="user.email">
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
import RolesModal from "@/components/roles-modal.vue";

export default {
  name: "Roles",
  components: { RolesModal },
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    ...mapState("roles", { isLoading: "isFindPending" }),
    ...mapGetters("roles", { findRolesInStore: "find" }),
    query() {
      return {};
    },
    roles() {
      return this.findRolesInStore({ query: this.query }).data;
    }
  },
  methods: { ...mapActions("roles", { findRoles: "find" }) }
};
</script>