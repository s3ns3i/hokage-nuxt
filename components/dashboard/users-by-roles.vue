<template>
  <v-card class="pb-4">
    <v-card-title>
      Użytkownicy przypisani do ról
    </v-card-title>
    <v-container>
      <v-row class="px-4">
        <v-col
          v-for="(role, i) in items"
          :key="role.id"
          :class="['pr-0', { 'pl-0': i === 0 }]"
        >
          <v-card>
            <v-card-title class="subtitle-1 primary lighten-1">{{
              `${role.name} (${role.users.length})`
            }}</v-card-title>
            <v-divider />
            <v-list v-if="role.users.length" dense>
              <v-list-item
                v-for="(user, j) in role.users"
                :key="user.id"
                :class="[
                  { 'grey lighten-3': j % 2 === 0 },
                  { 'grey darken-1': j % 2 === 0 && $vuetify.theme.dark }
                ]"
              >
                <v-list-item-content>{{ user.nickname }}</v-list-item-content>
              </v-list-item>
            </v-list>
            <v-list v-else>
              <v-list-item class="font-weight-bold">
                Brak danych
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "UsersByRoles",
  computed: {
    items() {
      return this.$store.getters["role/find"]({
        query: {}
      }).data.map(role => ({
        id: role.id,
        name: role.name,
        users: role.users
      }));
    }
  }
};
</script>

<style></style>
