<template>
  <v-card>
    <v-card-title class="headline">Dodaj rolę</v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <v-text-field v-model="clone.code" :counter="20" label="Kod" required />
        <v-text-field
          v-model="clone.name"
          :counter="50"
          label="Nazwa"
          required
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="$emit('close')">Anuluj</v-btn>
      <v-btn color="primary" @click="createRole()">
        Zapisz
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "RolesModal",
  data() {
    return {
      role: null,
      clone: null,
      valid: false
    };
  },
  created() {
    this.resetForm();
  },
  methods: {
    async createRole() {
      try {
        const role = await this.clone.save();
        this.resetForm();
        this.$emit("close");
      } catch (error) {
        console.error(error);
      }
    },
    resetForm() {
      const Role = this.$FeathersVuex.api.byServicePath.roles;
      this.role = new Role({});
      this.clone = this.role.clone();
    }
  }
};
</script>

<style>
</style>