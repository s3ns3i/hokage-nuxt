<template>
  <v-card>
    <v-card-title class="headline">
      Dodaj zadanie
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <v-autocomplete
          v-if="!taskTemp.id"
          v-model="clone.projectId"
          :items="projects"
          :rules="projectRules"
          @change="onProjectChange"
        />
        <v-text-field
          v-model="clone.name"
          :counter="50"
          :rules="nameRules"
          label="Tytuł rozdziału"
        />
        <v-text-field
          v-model="clone.chapterNo"
          :rules="chapterNoRules"
          label="Numer rozdziału"
          type="number"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text @click="$emit('close')">
        Anuluj
      </v-btn>
      <v-btn :disabled="!valid" color="primary" @click="createTask()">
        Zapisz
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TasksModal",
  props: {
    task: {
      type: Object,
      required: false,
      default() {
        return null;
      }
    }
  },
  data() {
    return {
      taskTemp: null,
      clone: null,
      valid: false,
      projectRules: [v => !!v || "Trzeba wybrać projekt!"],
      nameRules: [v => !!v || "Nazwa rozdziału jest wymagana!"],
      chapterNoRules: [
        v => !!v || "Numer rozdziału jest wymagany!",
        v => v >= 0 || "Numer rozdziału nie może być ujemny!"
      ]
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
  watch: {
    task() {
      this.resetForm();
    }
  },
  created() {
    this.resetForm();
  },
  methods: {
    async createTask() {
      if (this.valid) {
        try {
          const project = this.getProjectFromStore(this.clone.projectId);
          this.clone.roleId = project.project_roles[0].role.id;
          await this.clone.save();
          this.resetForm();
          this.$emit("close");
        } catch (error) {
          console.error(error);
        }
      }
    },
    resetForm() {
      const Task = this.$FeathersVuex.api.byServicePath.task;
      if (this.task) {
        this.taskTemp = new Task(this.task);
      } else {
        this.taskTemp = new Task({});
      }
      this.clone = this.taskTemp.clone();
    },
    async onProjectChange() {
      try {
        const result = await this.$store.dispatch("task/find", {
          query: {
            projectId: this.clone.projectId,
            $sort: {
              createdAt: -1
            },
            $limit: 1,
            $select: ["createdAt", "chapterNo"]
          }
        });
        const latestTask = result.data[0];
        if (latestTask) {
          this.clone.chapterNo = Math.floor(latestTask.chapterNo) + 1;
        } else {
          this.clone.chapterNo = 1;
        }
      } catch (error) {
        console.error(error);
        this.clone.chapterNo = 1;
      }
    }
  }
};
</script>

<style></style>
