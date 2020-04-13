import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({ isTaskInProgress: "getIsTaskInProgress" }),
    ...mapGetters("task", { findTasksInStore: "find" }),
  },
  methods: {
    getAvailableTasks() {
      const { user } = this.$store.state.auth;
      if (user) {
        const roleIds = user.roles.map(role => role.id);
        const projectIds = user.user_project_roles.map(userProjectRole => {
          return userProjectRole.project_role.projectId;
        });
        return this.findTasksInStore({
          query: {
            roleId: { $in: roleIds },
            projectId: { $in: projectIds },
            $or: [{ userId: user.id }, { userId: null }]
          }
        }).data;
      }
      return []
    }
  }
}