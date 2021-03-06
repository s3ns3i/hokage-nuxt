<template>
  <v-row class="px-3">
    <v-btn
      v-if="!isTaskTaken && isTaskAvailable"
      class="ma-3"
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
          v-if="isMoreThanOneProjectRole"
          color="error"
          class="ma-3"
          :disabled="
            isTaskInProgress || !isTaskTaken || !isMoreThanOneProjectRole
          "
          v-on="on"
          @click="dialogReject = true"
        >
          Odrzuć
        </v-btn>
      </template>
      <rejection-modal
        :project-roles="getPreviousProjectRoles()"
        @close="dialogReject = false"
        @confirm="onRejectTask"
      />
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import ConfirmationModal from "@/components/modals/confirmation-modal.vue";
import RejectionModal from "@/components/modals/rejection-modal.vue";

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
    ...mapGetters("auth", { getUserFromStore: "user" }),
    isTaskTaken() {
      if (this.currentTask) {
        const matchingRole = this.getUserFromStore.roles.find(
          role => role.id === this.currentTask.roleId
        );
        if (matchingRole) {
          return (
            this.currentTask.roleId === matchingRole.id &&
            this.currentTask.userId === this.getUserFromStore.id
          );
        }
      }
      return false;
    },
    isTaskAvailable() {
      if (this.currentTask) {
        return (
          this.currentTask.roleId ===
            this.getUserFromStore.roles.find(
              role => role.id === this.currentTask.roleId
            ) && this.currentTask.userId === null
        );
      } else {
        return false;
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
        .catch(error => {
          console.error(error);
          this.$store.dispatch("error-handler/addErrorMessage", {
            message: "Nie udało się porzucić zadania!"
          });
        });
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
          projectRole => projectRole.order === this.currentTask.projectRoleOrder
        ) + 1;
      return nextRoleIndex < this.currentProject.project_roles.length
        ? this.currentProject.project_roles[nextRoleIndex].role
        : null;
    },
    getPreviousProjectRoles() {
      if (
        !this.$route.params.id ||
        !this.currentProject ||
        this.currentTask.projectRoleOrder === 1
      ) {
        return [];
      }
      const projectRoles = this.currentProject.project_roles.map(
        (projectRole, index, projectRoles) => {
          let name = `${projectRole.role.name}`;
          if (index < projectRoles.length - 1) {
            name += ` -> ${projectRoles[index + 1].role.name}`;
          }
          return {
            value: projectRole.role.id,
            text: name
          };
        }
      );
      return projectRoles.slice(0, this.currentTask.projectRoleOrder - 1);
    },
    isMoreThanOneProjectRole() {
      if (this.currentTask) {
        return +this.currentTask.projectRoleOrder > 1;
      } else {
        return false;
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
    getNextOrder() {
      const projectRolesNo = this.currentProject.project_roles.length;
      const currentOrder = this.currentTask.projectRoleOrder;
      if (currentOrder < projectRolesNo) {
        return currentOrder + 1;
      } else {
        return null;
      }
    },
    async onPassOnTask() {
      const nextRole = this.getNextProjectRole();
      const userId = this.getNextUserIdIfOne();
      const projectRoleOrder = this.getNextOrder();
      this.$store
        .dispatch("task/patch", [
          this.$route.params.id,
          {
            userId,
            roleId: nextRole ? nextRole.id : null,
            projectRoleOrder,
            projectId: this.currentProject.id
          }
        ])
        .catch(error => {
          console.error(error);
          this.$store.dispatch("error-handler/addErrorMessage", {
            message: "Nie udało się przekazać zadania!"
          });
        });
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
        .catch(error => {
          console.error(error);
          this.$store.dispatch("error-handler/addErrorMessage", {
            message: "Nie udało się odrzucić zadania!"
          });
        });
      this.dialogReject = false;
    },
    getUserIdIfOne(roleId) {
      const projectRoles = this.currentProject.project_roles;
      if (projectRoles) {
        const projectRoleIndex = projectRoles.findIndex(
          projectRole => projectRole.roleId === roleId
        );
        if (
          projectRoleIndex > -1 &&
          projectRoles[projectRoleIndex].users.length === 1
        ) {
          return projectRoles[projectRoleIndex].users[0].id;
        }
      }
      return null;
    }
  }
};
</script>

<style></style>
