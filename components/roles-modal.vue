<template>
  <v-card>
    <v-card-title class="headline">
      Dodaj rolę
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <v-text-field
          v-model="clone.name"
          :counter="50"
          label="Nazwa"
          required
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        text
        @click="$emit('close')"
      >
        Anuluj
      </v-btn>
      <v-btn
        color="primary"
        @click="createRole()"
      >
        Zapisz
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "RolesModal",
  props: {
    role: {
      type: Object,
      required: false,
      default() {
        return null;
      }
    }
  },
  data() {
    return {
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
        await this.clone.save();
        this.resetForm();
        this.$emit("close");
      } catch (error) {
        console.error(error);
      }
    },
    resetForm() {
      const Role = this.$FeathersVuex.api.byServicePath.role;
      let roleModel = null;
      if (this.role) {
        roleModel = new Role(this.role);
      } else {
        roleModel = new Role({});
      }
      this.clone = roleModel.clone();
    }
  }
};
</script>

<style>
</style>
