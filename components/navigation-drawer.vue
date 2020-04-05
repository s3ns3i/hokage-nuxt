<template>
  <v-navigation-drawer app overflow permanent>
    <template v-slot:prepend>
      <v-list>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title class="title">{{
              user.nickname
            }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

    <v-divider></v-divider>

    <v-list nav>
      <v-list-item>
        <v-dialog v-model="dialog" persistent max-width="600">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" block tile v-on="on" @click="dialog = true"
              >Dodaj zadanie</v-btn
            >
          </template>
          <tasks-modal @close="dialog = false" />
        </v-dialog>
      </v-list-item>
      <v-list-item link nuxt to="/translations">
        <v-list-item-icon>
          <v-icon>mdi-folder</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Tłumaczenia</v-list-item-title>
      </v-list-item>
      <v-list-group prepend-icon="mdi-settings" no-action>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Ustawienia</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item link nuxt to="/settings/roles">
          <v-list-item-content>
            <v-list-item-title>Role</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link nuxt to="/settings/users">
          <v-list-item-content>
            <v-list-item-title>Użytkownicy</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link nuxt to="/settings/projects">
          <v-list-item-content>
            <v-list-item-title>Projekty</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import { makeFindMixin } from "feathers-vuex";
import TasksModal from "@/components/tasks-modal.vue";

export default {
  name: "NavigationDrawer",
  components: { TasksModal },
  computed: {
    user() {
      return this.$store.state.auth.user;
    }
  },
  data() {
    return {
      dialog: false
    };
  }
};
</script>