<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="5">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark>
            <v-toolbar-title>hokage</v-toolbar-title>
          </v-toolbar>
          <v-card-title>
            To pierwsze uruchomienie aplikacji. Musisz utworzyć konto
            administratora, aby kontynuować.
          </v-card-title>
          <v-card-text>
            <v-form v-model="valid">
              <v-text-field
                v-model="clone.email"
                :rules="emailRules"
                label="E-mail"
                type="email"
                autofocus
              />
              <v-text-field
                v-model="clone.nickname"
                :rules="nicknameRules"
                label="Ksywka"
                type="text"
              />
              <v-text-field
                v-model="clone.password"
                :rules="passwordRules"
                label="Hasło"
                type="password"
              />
              <v-text-field
                v-model="clone.confirmPassword"
                :rules="confirmPasswordRules"
                label="Potwierdź hasło"
                type="password"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" :disabled="!valid" @click="createUser">
              Utwórz konto administratora
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { makeFindMixin } from "feathers-vuex";

export default {
  name: "FirstUser",
  layout: "login",
  mixins: [makeFindMixin({ name: "users", service: "user", watch: true })],
  data() {
    return {
      user: null,
      clone: null,
      valid: false,
      emailRules: [
        v => !!v || "E-mail jest wymagany!",
        v => /.+@.+\..+/.test(v) || "E-mail musi być prawidłowy!"
      ],
      nicknameRules: [v => !!v || "Ksywka jest wymagana!"],
      passwordRules: [
        v => !!v || "Hasło jest wymagane!",
        v => v.length > 6 || "Hasło musi mieć przynajmniej 6 znaków!"
      ],
      confirmPasswordRules: [
        v => v === this.clone.password || "Hasła muszą być identyczne!"
      ]
    };
  },
  computed: {
    usersParams() {
      return {
        query: {},
        paginate: false
      };
    }
  },
  created() {
    const FirstUser = this.$FeathersVuex.api.byServicePath["user/first-user"];
    this.user = new FirstUser({});
    this.clone = this.user.clone();
  },
  methods: {
    async createUser() {
      if (this.valid) {
        try {
          await this.clone.save();
          await this.$store.dispatch("auth/authenticate", {
            strategy: "local",
            email: this.clone.email,
            password: this.clone.password
          });
          this.$router.push("/translations");
        } catch (error) {
          console.error(error);
          this.$store.dispatch("error-handler/addErrorMessage", {
            message: "Nie udało się utworzyć użytkownika!"
          });
        }
      }
    }
  }
};
</script>
