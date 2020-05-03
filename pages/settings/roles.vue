<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-dialog v-model="dialog" persistent max-width="600">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" @click="onDialogOpen()" v-on="on">
              Dodaj rolę
            </v-btn>
          </template>
          <roles-modal v-if="dialog" :role="role" @close="onDialogClose()" />
        </v-dialog>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Nazwa
                </th>
                <th class="text-left">
                  Użytkownicy o tej roli
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="role in roles"
                :key="role.id"
                class="table-row"
                @click="onDialogOpen(role)"
              >
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
import { mapGetters } from "vuex";
import RolesModal from "@/components/roles-modal.vue";

export default {
  name: "Roles",
  components: { RolesModal },
  data() {
    return {
      dialog: false,
      role: null
    };
  },
  computed: {
    ...mapGetters("role", { findRolesInStore: "find" }),
    query() {
      return {};
    },
    roles() {
      return this.findRolesInStore({ query: {} }).data;
    }
  },
  methods: {
    onDialogOpen(role) {
      this.role = role;
      this.dialog = true;
    },
    onDialogClose() {
      this.role = null;
      this.dialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.table-row {
  cursor: pointer;
}
</style>
