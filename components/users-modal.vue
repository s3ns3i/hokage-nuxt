<template>
  <v-card>
    <v-card-title class="headline">Dodaj użytkownika</v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <v-text-field
          v-model="clone.nickname"
          :counter="50"
          label="Ksywka"
          required
        />
        <v-text-field
          v-model="clone.email"
          :rules="emailRules"
          label="E-mail"
          required
        /><v-select
          v-model="clone.roles"
          :items="roles"
          :rules="[v => !!v || 'Role są wymagane!']"
          item-text="name"
          item-value="code"
          label="Role"
          return-object
          multiple
          chips
          clearable
          required
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="$emit('close')">Anuluj</v-btn>
      <v-btn color="primary" @click="createUser()">
        Zapisz
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { makeFindMixin } from "feathers-vuex";

export default {
  name: "UsersModal",
  mixins: [makeFindMixin({ service: "roles" })],
  data() {
    return {
      user: null,
      clone: null,
      valid: false,
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ]
    };
  },
  created() {
    this.resetForm();
  },
  computed: {
    rolesParams() {
      return { query: {}, paginate: false };
    }
  },
  methods: {
    async createUser() {
      try {
        const user = await this.clone.save();
        this.resetForm();
        this.$emit("close");
      } catch (error) {
        console.error(error);
      }
    },
    resetForm() {
      const User = this.$FeathersVuex.api.byServicePath.users;
      this.user = new User({});
      this.clone = this.user.clone();
    }
  }
};
</script>

<style>
</style>