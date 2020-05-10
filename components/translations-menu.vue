<template>
  <v-row class="px-3">
    <v-btn
      v-if="!isTaskTaken"
      class="ma-3"
      :disabled="!$route.params.id || !currentTask"
      @click="onTakeTask"
    >
      Przejmij zadanie
    </v-btn>
    <v-btn
      color="primary"
      class="ma-3"
      :disabled="!isTaskTaken"
      @click="onStartStopTask"
    >
      {{ isTaskInProgress ? "Zatrzymaj zadanie" : "Rozpocznij zadanie" }}
    </v-btn>
    <v-dialog
      v-if="isMoreThanOneUserWithThatRole"
      v-model="dialogAbandon"
      persistent
      max-width="600"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="error"
          class="ma-3"
          :disabled="isTaskInProgress || !isTaskTaken"
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
    <v-dialog v-model="dialogPass" persistent max-width="600">
      <template v-slot:activator="{ on }">
        <v-btn
          color="success"
          class="ma-3"
          :disabled="isTaskInProgress || !isTaskTaken"
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
    <v-dialog v-model="dialogReject" persistent max-width="600">
      <template v-slot:activator="{ on }">
        <v-btn
          color="error"
          class="ma-3"
          :disabled="
            isTaskInProgress ||
              !isTaskTaken ||
              !getPreviousProjectRoles().length
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

export default {
  name: "TranslationsMenu",
  components: { ConfirmationModal, RejectionModal },
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
    isTaskTaken() {
      if (this.currentTask) {
        return this.currentTask.userId !== null;
      } else {
        return true;
      }
    },
    isMoreThanOneUserWithThatRole() {
      const currentRoleId = this.currentTask ? this.currentTask.roleId : null;
      if (this.currentProject && currentRoleId) {
        const users = this.currentProject.project_roles.find(
          projectRole => projectRole.roleId === currentRoleId
        ).users;
        return users.length > 1;
      } else {
        return false;
      }
    },
    currentTask() {
      return this.getTaskFromStore(this.$route.params.id);
    },
    currentProject() {
      if (this.currentTask) {
        return this.getProjectFromStore(this.currentTask.projectId);
      } else {
        return null;
      }
    }
  },
  methods: {
    onTakeTask() {
      const user = this.$store.getters["auth/user"];
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
          projectRole => projectRole.roleId === this.currentTask.roleId
        ) + 1;
      return nextRoleIndex < this.currentProject.project_roles.length
        ? this.currentProject.project_roles[nextRoleIndex].role
        : null;
    },
    getPreviousProjectRoles() {
      if (!this.$route.params.id || !this.currentProject) {
        return [];
      }
      const projectRoles = this.currentProject.project_roles.map(
        projectRole => ({
          id: projectRole.role.id,
          name: projectRole.role.name
        })
      );
      const currentRoleIndex = this.currentProject.project_roles.findIndex(
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
      const projectRoles = this.currentProject.project_roles;
      const nextRoleIndex =
        projectRoles.findIndex(
          projectRole => projectRole.roleId === this.currentTask.roleId
        ) + 1;
      if (nextRoleIndex < projectRoles.length) {
        if (projectRoles[nextRoleIndex].users.length === 1) {
          return projectRoles[nextRoleIndex].users[0].id;
        }
      }
      return null;
    },
    async onPassOnTask() {
      const nextRole = this.getNextProjectRole();
      this.$store
        .dispatch("task/patch", [
          this.$route.params.id,
          {
            userId: this.getNextUserIdIfOne(),
            roleId: nextRole ? nextRole.id : null
          }
        ])
        .then(() =>
          this.$store.commit("task/removeItem", this.$route.params.id)
        );
      this.dialogPass = false;
    },
    onRejectTask({ roleId }) {
      this.$store
        .dispatch("task/patch", [
          this.$route.params.id,
          {
            userId: this.getUserIdIfOne(roleId),
            roleId
          }
        ])
        .then(() =>
          this.$store.commit("task/removeItem", this.$route.params.id)
        );
      this.dialogReject = false;
    },
    getUserIdIfOne(roleId) {
      const projectRoles = this.currentProject.project_roles;
      const projectRoleIndex = projectRoles.findIndex(
        projectRole => projectRole.roleId === roleId
      );
      if (projectRoles[projectRoleIndex].users.length === 1) {
        return projectRoles[projectRoleIndex].users[0].id;
      }
      return null;
    }
  }
};
</script>

<style></style>
