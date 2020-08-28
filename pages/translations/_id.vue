<template>
  <v-card flat>
    <vue-editor v-model="translation" :disabled="!isTaskInProgress" />
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Translation",
  data() {
    return {
      translation: ""
    };
  },
  computed: {
    ...mapGetters("task", {
      findTasksInStore: "find",
      getTaskFromStore: "get",
      isTaskInProgress: "getIsTaskInProgress"
    }),
    tasks() {
      return this.findTasksInStore({ query: {} }).data;
    },
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
    task(task) {
      if (!task) {
        this.translation = "";
      } else {
        this.getLatestTranslation();
      }
    }
  },
  mounted() {
    if (this.task) {
      this.getLatestTranslation();
    }
  },
  methods: {
    getLatestTranslation() {
      const translations = this.task.translations;
      this.translation = translations.length
        ? translations[translations.length - 1].translation
        : "";
    }
  }
};
</script>

<style></style>
