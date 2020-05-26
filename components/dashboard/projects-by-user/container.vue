<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(usersByRole, index) in usersByRoles"
        :key="usersByRole.role"
        md="12"
        lg="6"
      >
        <projects-by-user
          :profession="usersByRole.role"
          :data="usersByRole.users"
          :color="colors[index]"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProjectsByUser from "@/components/dashboard/projects-by-user.vue";

export default {
  name: "Container",
  components: {
    ProjectsByUser
  },
  data() {
    return {
      colors: [
        "palegoldenrod",
        "lightskyblue",
        "palegreen",
        "lightcoral",
        "turquoise",
        "plum",
        "lightpink",
        "gainsboro"
      ]
    };
  },
  computed: {
    usersByRoles() {
      const usersByRoles = [];
      const roles = this.$store.getters["role/list"];
      roles.slice(1, roles.length).forEach(role => {
        const users = this.$store.getters["user/list"];
        const mappedUsers = users.map(user => ({
          nickname: user.nickname,
          roles: user.roles.map(role => role.id),
          user_project_roles: user.user_project_roles,
          projects: 0
        }));
        let filteredUsers = mappedUsers.filter(user =>
          user.roles.find(userRole => userRole === role.id)
        );
        if (filteredUsers) {
          filteredUsers.forEach(user => {
            const projects = user.user_project_roles.filter(
              userProjectRole => userProjectRole.project_role.roleId === role.id
            );
            user.projects = projects ? projects.length : 0;
          });
          usersByRoles.push({
            role: role.name,
            users: filteredUsers.map(user => ({
              text: user.nickname,
              value: user.projects
            }))
          });
        }
      });
      return usersByRoles;
    }
  }
};
</script>

<style></style>
