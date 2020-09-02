<template>
  <div>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Rozdziały
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider />
    <v-list v-model="tasks" :disabled="isTaskInProgress">
      <v-list-item-group v-model="item" color="primary">
        <v-list-item
          v-for="(task, index) in tasks"
          :key="index"
          two-line
          link
          nuxt
          :to="`/translations/${task.id}`"
        >
          <v-list-item-content>
            <v-list-item-title>{{ task.name }}</v-list-item-title>
            <v-list-item-subtitle>{{
              `${task.project.name} ${task.chapterNo}`
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TranslationsDrawer",
  data() {
    return {
      item: 0
    };
  },
  computed: {
    ...mapGetters("task", {
      listTasksFromStore: "list",
      isTaskInProgress: "getIsTaskInProgress"
    }),
    ...mapGetters("auth", ["user"]),
    tasks() {
      return this.listTasksFromStore
        .filter(task => task && this.isUserAssignedToProject(task))
        .filter(
          task =>
            task &&
            (this.isTaskAssignedToUser(task) || this.isTaskAvailable(task))
        );
    }
  },
  watch: {
    tasks() {
      if (this.tasks.length) {
        this.$router.push(`/translations/${this.tasks[0].id}`);
      }
    }
  },
  methods: {
    isUserAssignedToProject(task) {
      return this.user.user_project_roles
        .map(userProjectRole => userProjectRole.project_role.projectId)
        .includes(task.projectId);
    },
    isTaskAssignedToUser(task) {
      const rolesIds = this.user.roles.map(role => role.id);
      return task.userId === this.user.id && rolesIds.includes(task.roleId);
    },
    isTaskAvailable(task) {
      const role = this.user.roles.find(role => role.id === task.roleId);
      return task.userId === null && !!task.roleId && task.roleId === role
        ? !!role.id
        : false;
    }
  }
};
</script>
