<template>
  <v-card>
    <v-card-title class="headline">
      Odrzuć zadanie
    </v-card-title>
    <v-card-text>
      Wybierz, gdzie ma trafić zadanie:
    </v-card-text>
    <v-card-text>
      <v-select v-model="roleId" :items="roles" label="Wybierz rolę" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text @click="$emit('close')">
        Anuluj
      </v-btn>
      <v-btn color="primary" @click="$emit('confirm', { roleId })">
        Odrzuć
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "RejectionModal",
  props: {
    roles: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      roleId: null
    };
  }
};
</script>

<style></style>
