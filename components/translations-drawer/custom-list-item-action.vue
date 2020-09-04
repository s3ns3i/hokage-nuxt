<template>
  <v-list-item-action>
    <v-dialog v-model="dialog" persistent max-width="600">
      <template v-slot:activator="{ on }">
        <v-btn icon @click.prevent="dialog = true" v-on="on">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <tasks-modal :task="task" @close="dialog = false" />
    </v-dialog>
  </v-list-item-action>
</template>

<script>
import TasksModal from "@/components/tasks-modal.vue";

export default {
  name: "CustomListItemAction",
  components: { TasksModal },
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialog: false
    };
  }
};
</script>

<style></style>
