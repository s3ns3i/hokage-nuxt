<template>
  <vue-editor v-model="translation" :disabled="!isTaskInProgress" />
</template>

<script>
import { mapGetters } from "vuex";

export default {
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
      return this.getTaskFromStore(this.$route.params.id);
    }
  }
};
</script>

<style>
</style>