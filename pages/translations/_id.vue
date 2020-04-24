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
  computed: {
    ...mapGetters("task", {
      getTaskFromStore: "get",
      isTaskInProgress: "getIsTaskInProgress"
    }),
    task() {
      const foundTask = this.tasks.find(
        task => `${task.id}` === this.$route.params.id
      );
      if (foundTask) {
        return this.getTaskFromStore(this.$route.params.id);
      } else {
        return null;
      }
    }
  },
  watch: {
    isTaskInProgress(value) {
      if (!value) {
        this.$store.dispatch("task/patch", [
          this.task.id,
          { translation: this.translation }
        ]);
      }
    },
    task(value) {
      if (!value) {
        this.translation = "";
      }
    }
  },
  mounted() {
    if (this.task) {
      const translations = this.task.translations;
      this.translation = translations.length
        ? translations[translations.length - 1].translation
        : "";
    }
  }
};
</script>

<style></style>
