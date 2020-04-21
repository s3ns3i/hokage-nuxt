import { mapGetters } from "vuex";

export default {
  data() {
    return {
      user: this.$store.state.auth.user
    };
  },
  computed: {
    ...mapGetters("task", {
      findTasksInStore: "find",
      isTaskInProgress: "getIsTaskInProgress"
    }),
    roleIds() {
      return this.user.roles.map(role => role.id);
    },
    projectIds() {
      const result = this.user.user_project_roles.map(userProjectRole => {
        return userProjectRole.project_role.projectId;
      })
      return result
    },
    tasks() {
      return this.findTasksInStore({query: {
            roleId: { $in: this.roleIds },
            projectId: { $in: this.projectIds },
            $or: [{ userId: this.user.id }, { userId: null }],
          }
        }).data;
    }
  }
};
