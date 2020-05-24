<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(role, i) in items"
        :key="role.id"
        :class="['pr-0', { 'pl-0': i === 0 }]"
      >
        <v-card>
          <v-card-title class="subtitle-1 primary lighten-1">{{
            role.name
          }}</v-card-title>
          <v-divider />
          <v-list v-if="role.users.length" dense>
            <v-list-item
              v-for="(user, j) in role.users"
              :key="user.id"
              :class="[
                { 'primary lighten-4': j % 2 === 0 },
                { 'primary darken-1': j % 2 === 0 && $vuetify.theme.dark }
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
