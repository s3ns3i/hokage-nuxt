<template>
  <v-card>
    <v-card-title class="headline">
      {{ header }}
    </v-card-title>
    <v-card-text>
      {{ message }}
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        text
        @click="$emit('close')"
      >
        Nie
      </v-btn>
      <v-btn
        color="primary"
        @click="$emit('confirm')"
      >
        Tak
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ConfirmationModal",
  props: {
    header: {
      type: String,
      required: false,
      default: "Potwierdzenie"
    },
    message: {
      type: String,
      required: true
    }
  }
};
</script>

<style>
</style>
