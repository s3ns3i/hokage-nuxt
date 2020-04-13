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
          autofocus
        />
        <v-text-field
          v-model="clone.email"
          :rules="emailRules"
          label="E-mail"
          type="email"
          required
        />
        <v-text-field
          v-model="clone.password"
          label="Hasło"
          type="password"
          required
        />
        <v-select
          v-model="clone.roles"
          :items="roles"
          :rules="[v => !!v || 'Role są wymagane!']"
          item-text="name"
          item-value="id"
          label="Rola"
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
      <v-btn text @click="closeModal()">Anuluj</v-btn>
      <v-btn :disabled="!valid" color="primary" @click="createUser()">
        Zapisz
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "UsersModal",
  props: {
    user: {
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
      valid: false,
      emailRules: [
        v => !!v || "E-mail jest wymagany!",
        v => /.+@.+\..+/.test(v) || "E-mail jest wymagany!"
      ]
    };
  },
  created() {
    this.resetForm();
  },
  computed: {
    ...mapGetters("role", { findRolesInStore: "find" }),
    roles() {
      return this.findRolesInStore({ query: {} }).data;
    }
  },
  methods: {
    async createUser() {
      if (this.valid) {
        try {
          await this.clone.save();
          this.resetForm();
          this.$emit("close");
        } catch (error) {
          console.error(error);
        }
      }
    },
    resetForm() {
      const User = this.$FeathersVuex.api.byServicePath.user;
      let userModel = null;
      if (this.user) {
        userModel = new User(this.user);
      } else {
        userModel = new User({});
      }
      this.clone = userModel.clone();
    },
    closeModal() {
      this.resetForm();
      this.$emit("close");
    }
  }
};
</script>

<style>
</style>