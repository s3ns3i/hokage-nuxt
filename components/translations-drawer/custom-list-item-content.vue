<template>
  <v-list-item-content>
    <v-list-item-title>{{ task.text }}</v-list-item-title>
    <v-list-item-subtitle>{{ task.description }}</v-list-item-subtitle>
  </v-list-item-content>
</template>

<script>
export default {
  name: "CustomListItemContent",
  props: {
    task: {
      type: Object,
      required: true
    }
  }
};
</script>

<style></style>
