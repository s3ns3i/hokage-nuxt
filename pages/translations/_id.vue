<template>
  <vue-editor v-model="translation" :disabled="!isTaskInProgress" />
</template>

<script>
import { mapGetters } from "vuex";
import AvailableTasks from "@/mixins/available-tasks";

export default {
  mixins: [AvailableTasks],
  data() {
    return {
      translation: ""
    };
  },
  mounted() {
    if (this.task) {
      this.translation = this.task.translation;
    }
  },
  computed: {
    ...mapGetters({ isTaskInProgress: "getIsTaskInProgress" }),
    ...mapGetters("task", { getTaskFromStore: "get" }),
    task() {
      const foundTask = this.getAvailableTasks().find(
        task => `${task.id}` === this.$route.params.id
      );
      if (foundTask) {
        return this.getTaskFromStore(this.$route.params.id);
      } else {
        return null;
      }
    }
  }
};
</script>

<style>
</style>