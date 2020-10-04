<template>
  <v-container fluid>
    <v-row justify-lg="center">
      <v-col lg="5">
        <v-card>
          <v-card-title class="headline">
            Twoje dane
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
              <v-switch
                v-model="clone.emailNotifications"
                label="Powiadomienia e-mail"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="resetUserForm()">
              Anuluj
            </v-btn>
            <v-btn
              :disabled="!valid || !dirty"
              color="primary"
              @click="saveUserForm()"
            >
              Zapisz
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Settings",
  data() {
    return {
      clone: null,
      valid: false,
      dirty: false,
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
      ]
    };
  },
  watch: {
    clone: {
      handler() {
        const user = this.$store.getters["auth/user"];
        this.dirty =
          this.clone.nickname !== user.nickname ||
          this.clone.email !== user.email ||
          this.clone.password !== user.password ||
          this.clone.emailNotifications !== user.emailNotifications;
      },
      deep: true
    }
  },
  created() {
    const user = this.$store.getters["auth/user"];
    const User = this.$FeathersVuex.api.byServicePath.user;
    this.clone = new User(user).clone();
  },
  methods: {
    resetUserForm() {
      this.clone.reset();
    },
    async saveUserForm() {
      try {
        await this.clone.save();
        this.dirty = false;
      } catch (error) {
        console.error(error);
        this.$store.dispatch("error-handler/addErrorMessage", {
          message: "Coś poszło nie tak przy zapisywaniu!"
        });
      }
    }
  }
};
</script>
