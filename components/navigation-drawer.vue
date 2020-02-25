<template>
  <v-navigation-drawer app overflow permanent>
    <template v-slot:prepend>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img
              src="https://randomuser.me/api/portraits/women/85.jpg"
            ></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link two-line>
          <v-list-item-content>
            <v-list-item-title class="title">Sandra Adams</v-list-item-title>
            <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

    <v-divider></v-divider>

    <v-list nav dense>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-folder</v-icon>
        </v-list-item-icon>
        <v-list-item-title>My Files</v-list-item-title>
      </v-list-item>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-account-multiple</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Shared with me</v-list-item-title>
      </v-list-item>
      <v-list-group prepend-icon="mdi-settings" no-action>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Ustawienia</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item link nuxt to="/settings/users">
          <v-list-item-content>
            <v-list-item-title>Użytkownicy</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { makeFindMixin } from "feathers-vuex";

export default {
  name: "NavigationDrawer",
  data() {
    return {
      nickname: ""
    };
  }
};
</script>