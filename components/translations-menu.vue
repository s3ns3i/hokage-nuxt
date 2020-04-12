<template>
  <v-row class="px-3">
    <v-btn v-if="isTaskNotTaken" class="ma-3" @click="onTakeTask"
      >Przejmij zadanie</v-btn
    >
    <v-btn
      color="primary"
      class="ma-3"
      :disabled="isTaskNotTaken"
      @click="onStartStopTask"
      >{{
        isTaskInProgress ? "Zatrzymaj zadanie" : "Rozpocznij zadanie"
      }}</v-btn
    >
    <v-dialog v-model="dialogAbandon" persistent max-width="600">
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          color="error"
          class="ma-3"
          :disabled="isTaskInProgress || isTaskNotTaken"
          @click="dialogAbandon = true"
          >Porzuć zadanie</v-btn
        >
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
          v-on="on"
          color="success"
          class="ma-3"
          :disabled="isTaskInProgress || isTaskNotTaken"
          @click="onDialogPassOpen"
          >Przekaż dalej</v-btn
        >
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
          v-on="on"
          color="error"
          class="ma-3"
          :disabled="isTaskInProgress || isTaskNotTaken"
          @click="dialogReject = true"
          >Odrzuć</v-btn
        >
      </template>
      <confirmation-modal
        message="Czy na pewno chcesz odrzucić zadanie?"
        @close="dialogReject = false"
        @confirm="onRejectTask"
      />
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import ConfirmationModal from "@/components/confirmation-modal.vue";
import AvailableTasks from "@/mixins/available-tasks";

export default {
  name: "TranslationsMenu",
  components: { ConfirmationModal },
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
    ...mapGetters({ isTaskInProgress: "getIsTaskInProgress" }),
    ...mapGetters("task", { getTaskFromStore: "get" }),
    isTaskNotTaken() {
      const currentTask = this.getAvailableTasks().find(
        task => `${task.id}` === this.$route.params.id
      );
      if (currentTask) {
        return currentTask.userId === null;
      } else {
        return true;
      }
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
      this.$store.dispatch("setIsTaskInProgress", {
        isTaskInProgress: !this.isTaskInProgress
      });
    },
    onAbandonTask() {
      this.$store
        .dispatch("task/patch", [this.$route.params.id, { userId: null }])
        .then(() => (this.dialogAbandon = false))
        .catch(error => console.error(error));
      // send patch to back-end and set userId to null
    },
    onDialogPassOpen() {
      const nextRole = this.getNextRole();
      if (nextRole) {
        this.dialogHeader = `Następny: ${nextRole.name}`;
        this.dialogMessage = "Czy na pewno chcesz przekazać zadanie?";
      } else {
        this.dialogHeader = `Koniec zadania`;
        this.dialogMessage = "Czy na pewno chcesz zakończyć zadanie?";
      }
      this.dialogPass = true;
    },
    getNextRole() {
      const roles = this.$store.getters["role/find"]().data;
      console.log(roles);
      const nextRoleId =
        roles.findIndex(
          role =>
            role.id === this.getTaskFromStore(this.$route.params.id).roleId
        ) + 1;
      return roles[nextRoleId];
    },
    onPassOnTask() {
      // Set userId to null,
      // Set roleId to the next role
      const nextRole = this.getNextRole();
      this.$store.dispatch("task/patch", [
        this.$route.params.id,
        { userId: null, roleId: nextRole ? nextRole.id : null }
      ]);
      this.dialogPass = false;
    },
    onRejectTask() {}
  }
};
</script>

<style>
</style>