<template>
  <div>
    <vue-editor v-model="translation" :disabled="false" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { VueEditor } from "vue2-editor";

export default {
  components: { VueEditor },
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
    ...mapGetters("task", { getTaskFromStore: "get" }),
    task() {
      return this.getTaskFromStore(this.$route.params.id);
    }
  }
};
</script>

<style>
</style>