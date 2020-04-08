<template>
  <div>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">Rozdziały</v-list-item-title>
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
            <v-list-item-subtitle>{{ task.project.name }}</v-list-item-subtitle>
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
    ...mapGetters({ isTaskInProgress: "getIsTaskInProgress" }),
    ...mapGetters("task", { findTasksInStore: "find" }),
    tasks() {
      return this.findTasksInStore({ query: {} }).data;
    }
  },
  watch: {
    tasks() {
      if (this.tasks.length) {
        this.$router.push(`/translations/${this.tasks[0].id}`);
      }
    }
  },
  created() {
    this.$store.dispatch("task/find", { query: {} });
  }
};
</script>