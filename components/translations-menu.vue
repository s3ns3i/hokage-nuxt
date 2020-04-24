<template>
  <v-row class="px-3">
    <v-btn
      v-if="isTaskNotTaken"
      class="ma-3"
      :disabled="!$route.params.id"
      @click="onTakeTask"
    >
      Przejmij zadanie
    </v-btn>
    <v-btn
      color="primary"
      class="ma-3"
      :disabled="isTaskNotTaken"
      @click="onStartStopTask"
    >
      {{
        isTaskInProgress ? "Zatrzymaj zadanie" : "Rozpocznij zadanie"
      }}
    </v-btn>
    <v-dialog
      v-model="dialogAbandon"
      persistent
      max-width="600"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="error"
          class="ma-3"
          :disabled="isTaskInProgress || isTaskNotTaken"
          v-on="on"
          @click="dialogAbandon = true"
        >
          Porzuć zadanie
        </v-btn>
      </template>
      <confirmation-modal
        message="Czy na pewno chcesz porzucić zadanie?"
        @close="dialogAbandon = false"
        @confirm="onAbandonTask"
      />
    </v-dialog>
    <v-spacer />
    <v-dialog
      v-model="dialogPass"
      persistent
      max-width="600"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="success"
          class="ma-3"
          :disabled="isTaskInProgress || isTaskNotTaken"
          v-on="on"
          @click="onDialogPassOpen"
        >
          Przekaż dalej
        </v-btn>
      </template>
      <confirmation-modal
        :header="dialogHeader"
        :message="dialogMessage"
        @close="dialogPass = false"
        @confirm="onPassOnTask"
      />
    </v-dialog>
    <v-dialog
      v-model="dialogReject"
      persistent
      max-width="600"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="error"
          class="ma-3"
          :disabled="
            isTaskInProgress || isTaskNotTaken || !getPreviousProjectRoles().length
          "
          v-on="on"
          @click="dialogReject = true"
        >
          Odrzuć
        </v-btn>
      </template>
      <rejection-modal
        :roles="getPreviousProjectRoles()"
        @close="dialogReject = false"
        @confirm="onRejectTask"
      />
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import ConfirmationModal from "@/components/confirmation-modal.vue";
import RejectionModal from "@/components/rejection-modal.vue";
import AvailableTasks from "@/mixins/available-tasks";

export default {
  name: "TranslationsMenu",
  components: { ConfirmationModal, RejectionModal },
  mixins: [AvailableTasks],
  data() {
    return {
      dialogAbandon: false,
      dialogPass: false,
      dialogReject: false,
      dialogHeader: "",
      dialogMessage: ""
    };
  },
  computed: {
    ...mapGetters("task", {
      getTaskFromStore: "get",
      isTaskInProgress: "getIsTaskInProgress"
    }),
    ...mapGetters("project", { getProjectFromStore: "get" }),
    isTaskNotTaken() {
      if (this.currentTask) {
        return this.currentTask.userId === null;
      } else {
        return true;
      }
    },
    currentTask() {
      return this.getTaskFromStore(this.$route.params.id)
    },
    currentProject() {
      return this.getProjectFromStore(this.currentTask.projectId)
    }
  },
  methods: {
    onTakeTask() {
      const { user } = this.$store.state.auth;
      this.$store.dispatch("task/patch", [
        this.$route.params.id,
        { userId: user.id }
      ]);
    },
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
      this.$store.dispatch("task/setIsTaskInProgress", {
        isTaskInProgress: !this.isTaskInProgress
      });
    },
    onAbandonTask() {
      this.$store
        .dispatch("task/patch", [this.$route.params.id, { userId: null }])
        .then(() => (this.dialogAbandon = false))
        .catch(error => console.error(error));
    },
    onDialogPassOpen() {
      const nextRole = this.getNextProjectRole();
      if (nextRole) {
        this.dialogHeader = `Następny: ${nextRole.name}`;
        this.dialogMessage = "Czy na pewno chcesz przekazać zadanie?";
      } else {
        this.dialogHeader = `Koniec zadania`;
        this.dialogMessage = "Czy na pewno chcesz zakończyć zadanie?";
      }
      this.dialogPass = true;
    },
    onDialogRejectOpen() {
      this.dialogReject = true;
    },
    getNextProjectRole() {
      const nextRoleIndex =
        this.currentProject.project_roles.findIndex(
          projectRole =>
            projectRole.roleId === this.currentTask.roleId
        ) + 1;
      return nextRoleIndex < this.currentProject.project_roles.length
        ? this.currentProject.project_roles[nextRoleIndex].role
        : null;
    },
    getPreviousProjectRoles() {
      if (!this.$route.params.id || !this.currentProject) {
        return [];
      }
      const projectRoles = this.currentProject.project_roles
      .map(projectRole => ({
        id: projectRole.role.id,
        name: projectRole.role.name
      }))
      const currentRoleIndex = this.currentProject.project_roles
      .findIndex(
        projectRole => projectRole.roleId === this.currentTask.roleId
      );
      if (currentRoleIndex) {
        return projectRoles
          .slice(0, currentRoleIndex)
          .map(role => ({ value: role.id, text: role.name }));
      } else {
        return [];
      }
    },
    getNextUserIdIfOne() {
      const nextRoleIndex =
        this.currentProject.project_roles.findIndex(
          projectRole =>
            projectRole.roleId === this.currentTask.roleId
        ) + 1;
      if(nextRoleIndex < this.currentProject.project_roles.length) {
        if(this.currentProject.project_roles[nextRoleIndex].users.length === 1) {
          return this.currentProject.project_roles[nextRoleIndex].users[0].id
        }
      }
      return null;
    },
    async onPassOnTask() {
      const nextRole = this.getNextProjectRole();
      this.$store.dispatch("task/patch", [
        this.$route.params.id, {
          projectId: this.currentTask.projectId,
          userId: this.getNextUserIdIfOne(),
          roleId: nextRole ? nextRole.id : null
        }
      ]);
      this.dialogPass = false;
    },
    onRejectTask({ roleId }) {
      this.$store.dispatch("task/patch", [
        this.$route.params.id, {
          projectId: this.currentTask.projectId,
          userId: this.getNextUserIdIfOne(),
          roleId
        }
      ]);
      this.dialogReject = false;
    }
  }
};
</script>

<style></style>
