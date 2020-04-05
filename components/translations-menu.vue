<template>
  <v-row class="px-3">
    <v-btn color="primary" class="ma-3" @click="onStartStopTask"
      >Rozpocznij zadanie</v-btn
    >
    <v-btn color="error" class="ma-3" :disabled="isTaskInProgress"
      >Porzuć zadanie</v-btn
    >
    <v-spacer />
    <v-btn color="success" class="ma-3" :disabled="isTaskInProgress"
      >Przekaż dalej</v-btn
    >
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TranslationsMenu",
  computed: {
    ...mapGetters({ isTaskInProgress: "getIsTaskInProgress" })
  },
  methods: {
    onStartStopTask() {
      if (this.isTaskInProgress) {
        window.onbeforeunload = null;
      } else {
        window.onbeforeunload = function(e) {
          e = e || window.event;

          // For IE and Firefox prior to version 4
          if (e) {
            e.returnValue = "Any string";
          }

          // For Safari
          return "Any string";
        };
      }
      this.$store.dispatch("setIsTaskInProgress", {
        isTaskInProgress: !this.isTaskInProgress
      });
    }
  }
};
</script>

<style>
</style>