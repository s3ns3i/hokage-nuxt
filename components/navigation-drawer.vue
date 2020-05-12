<template>
  <v-navigation-drawer app overflow permanent>
    <template v-slot:prepend>
      <v-list>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ user.nickname }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

    <v-divider />

    <v-list nav :disabled="isTaskInProgress">
      <v-list-item>
        <v-dialog v-model="dialog" persistent max-width="600">
          <template v-slot:activator="{ on }">
            <v-btn
              color="primary"
              block
              tile
              :disabled="isTaskInProgress"
              v-on="on"
              @click="dialog = true"
            >
              Dodaj zadanie
            </v-btn>
          </template>
          <tasks-modal @close="dialog = false" />
        </v-dialog>
      </v-list-item>
      <v-list-item link nuxt to="/translations">
        <v-list-item-icon>
          <v-icon>mdi-alphabetical</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Tłumaczenia</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link nuxt to="/dashboard">
        <v-list-item-icon>
          <v-icon>mdi-chart-bar</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Statystyki</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link nuxt to="/settings">
        <v-list-item-icon>
          <v-icon>mdi-account-cog</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Ustawienia</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-group v-if="isAdmin()" no-action>
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon>mdi-key</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Administracja</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item link nuxt to="/administration/roles">
          <v-list-item-content>
            <v-list-item-title>Role</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-sitemap</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item link nuxt to="/administration/users">
          <v-list-item-content>
            <v-list-item-title>Użytkownicy</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item link nuxt to="/administration/projects">
          <v-list-item-content>
            <v-list-item-title>Projekty</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-briefcase</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import TasksModal from "@/components/tasks-modal.vue";

export default {
  name: "NavigationDrawer",
  components: { TasksModal },
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    ...mapGetters("task", { isTaskInProgress: "getIsTaskInProgress" }),
    user() {
      return this.$store.state.auth.user
        ? this.$store.state.auth.user
        : { nickname: "", email: "", roles: [] };
    }
  },
  methods: {
    isAdmin() {
      return !!this.user.roles.find(role => `${role.id}` === "1");
    }
  }
};
</script>
