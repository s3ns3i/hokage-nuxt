<template>
  <v-row>
    <v-col v-for="role in items" :key="role.id">
      <v-card>
        <v-card-title class="primary lighten-1">{{ role.name }}</v-card-title>
        <v-divider />
        <v-list v-if="role.users.length" dense>
          <v-list-item
            v-for="(user, index) in role.users"
            :key="user.id"
            :class="[
              { 'primary lighten-4': index % 2 === 0 },
              { 'primary darken-1': index % 2 === 0 && $vuetify.theme.dark }
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
