<template>
  <v-card>
    <v-card-title class="headline">
      Dodaj użytkownika
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <v-text-field
          v-model="clone.nickname"
          :counter="50"
          :rules="nicknameRules"
          label="Ksywka"
          autofocus
        />
        <v-text-field
          v-model="clone.email"
          :rules="emailRules"
          label="E-mail"
          type="email"
        />
        <v-text-field
          v-model="clone.password"
          :rules="passwordRules"
          label="Hasło"
          type="password"
        />
        <v-select
          v-model="clone.roles"
          :items="roles"
          :rules="rolesRules"
          item-text="name"
          item-value="id"
          label="Rola"
          return-object
          multiple
          chips
          clearable
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text @click="closeModal()">
        Anuluj
      </v-btn>
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
      nicknameRules: [v => !!v || "Ksywka jest wymagana!"],
      emailRules: [
        v => !!v || "E-mail jest wymagany!",
        v => /.+@.+\..+/.test(v) || "E-mail jest wymagany!"
      ],
      passwordRules: [
        v => {
          if (!this.clone.id) {
            return !!v || "Hasło jest wymagane!";
          } else {
            return true;
          }
        }
      ],
      rolesRules: [v => !!v.length || "Przynajmniej jedna rola jest wymagana!"]
    };
  },
  computed: {
    ...mapGetters("role", { findRolesInStore: "find" }),
    roles() {
      return this.findRolesInStore({ query: {} }).data;
    }
  },
  created() {
    this.resetForm();
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

<style></style>
