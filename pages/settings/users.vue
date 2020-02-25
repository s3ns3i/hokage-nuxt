<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="overlay = true">Dodaj użytkownika</v-btn>
        <v-overlay :value="overlay">
          <v-btn @click="overlay = false">Zamknij modal</v-btn>
        </v-overlay>
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
import { makeFindMixin } from "feathers-vuex";

export default {
  name: "Users",
  layout: "default",
  mixins: [makeFindMixin({ service: "users" })],
  data() {
    return {
      overlay: false
    };
  },
  computed: {
    usersParams() {
      return { query: {}, paginate: false };
    }
  }
};
</script>