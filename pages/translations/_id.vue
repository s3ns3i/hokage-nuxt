<template>
  <v-card flat :style="cssVars">
    <v-card-title>{{ currentProjectRoleName }}</v-card-title>
    <vue-editor
      v-model="translation"
      class="editor"
      :disabled="!isTaskInProgress"
    />
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Translation",
  data() {
    return {
      translation: "",
      saverInterval: null,
      editorHeight: 0,
      resizeListener: null
    };
  },
  computed: {
    ...mapGetters("task", {
      findTasksInStore: "find",
      getTaskFromStore: "get",
      isTaskInProgress: "getIsTaskInProgress"
    }),
    ...mapGetters("project", {
      getProjectFromStore: "get"
    }),
    projectRoles() {
      if (this.task) {
        return this.getProjectFromStore(this.task.projectId).project_roles;
      } else {
        return null;
      }
    },
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
    },
    currentProjectRoleName() {
      let projectRoleName = "Obecny etap: ";
      if (this.projectRoles) {
        console.log(this.projectRoles);
        projectRoleName += this.projectRoles.find(
          projectRole => projectRole.order === this.task.projectRoleOrder
        ).role.name;
      }
      return projectRoleName;
    },
    cssVars() {
      return {
        "--editor-height": `calc(100vh - ${this.editorHeight}px)`
      };
    }
  },
  watch: {
    isTaskInProgress(value) {
      if (value) {
        this.saverInterval = setInterval(() => {
          this.saveTranslation();
        }, 10000);
      } else {
        clearInterval(this.saverInterval);
        this.saveTranslation();
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
  created() {
    this.resizeListener = window.addEventListener("resize", () => {
      this.calculateEditorHeight();
    });
  },
  mounted() {
    if (this.task) {
      this.getLatestTranslation();
    }
    this.calculateEditorHeight();
  },
  beforeDestroy() {
    if (this.isTaskInProgress) {
      this.saveTranslation();
      clearInterval(this.saverInterval);
    }
    window.removeEventListener("resize", this.resizeListener);
  },
  methods: {
    getLatestTranslation() {
      const translations = this.task.translations;
      this.translation = translations.length
        ? translations[translations.length - 1].translation
        : "";
    },
    saveTranslation() {
      this.$store.dispatch("task/patch", [
        this.task.id,
        { translation: this.translation }
      ]);
    },
    calculateEditorHeight() {
      const parentRefs = this.$parent.$refs;

      if (parentRefs) {
        this.editorHeight = parentRefs.translationsMenu.clientHeight + 250;
        if (this.$vuetify.breakpoint.smAndDown) {
          this.editorHeight += parentRefs.translationsDrawer.clientHeight;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.editor {
  min-height: var(--editor-height);
  height: var(--editor-height);
  display: flex;
  flex-direction: column;
}
</style>
