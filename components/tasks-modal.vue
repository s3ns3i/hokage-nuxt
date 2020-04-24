<template>
  <v-card>
    <v-card-title class="headline">
      Dodaj zadanie
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <v-autocomplete
          v-model="clone.projectId"
          :items="projects"
          required
          @change="onProjectChange"
        />
        <v-text-field
          v-model="clone.name"
          :counter="50"
          label="Tytuł rozdziału"
          required
        />
        <v-text-field
          v-model="clone.chapterNo"
          label="Numer rozdziału"
          type="number"
          required
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text @click="$emit('close')">
        Anuluj
      </v-btn>
      <v-btn color="primary" @click="createTask()">
        Zapisz
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TasksModal",
  data() {
    return {
      task: null,
      clone: null,
      valid: false
    };
  },
  computed: {
    ...mapGetters("project", {
      findProjectsInStore: "find",
      getProjectFromStore: "get"
    }),
    projects() {
      return this.findProjectsInStore({ query: { suspended: false } }).data.map(
        project => ({
          value: project.id,
          text: project.name
        })
      );
    }
  },
  created() {
    this.resetForm();
  },
  methods: {
    async createTask() {
      try {
        const project = this.getProjectFromStore(this.clone.projectId);
        this.clone.roleId = project.project_roles[0].role.id;
        await this.clone.save();
        this.resetForm();
        this.$emit("close");
      } catch (error) {
        console.error(error);
      }
    },
    resetForm() {
      const Task = this.$FeathersVuex.api.byServicePath.task;
      this.task = new Task({});
      this.clone = this.task.clone();
    },
    onProjectChange() {
      const latestTask = this.$store.getters["task/find"]({
        query: {
          projectId: this.clone.projectId,
          $sort: {
            createdAt: -1
          },
          $limit: 1
        }
      }).data[0];
      if (latestTask) {
        this.clone.chapterNo = Math.floor(latestTask.chapterNo) + 1;
      }
    }
  }
};
</script>

<style></style>
