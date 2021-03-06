<template>
  <v-card>
    <v-card-title class="headline">
      Dodaj projekt
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <v-text-field
          v-model="clone.name"
          :counter="50"
          :rules="[v => !!v || 'Nazwa jest wymagana!']"
          label="Tytuł"
          required
          autofocus
        />
        <v-text-field v-model="clone.volumesNo" label="Liczba tomów" />
        <v-row v-for="n in tempRoles.length" :key="n">
          <v-col align-self="center">
            <v-select
              v-model="tempRoles[n - 1]"
              :items="roles"
              :rules="[v => !!v || 'Role są wymagane!']"
              item-text="name"
              item-value="id"
              label="Rola"
              return-object
              required
            />
          </v-col>
          <v-col align-self="center">
            <v-select
              v-model="tempUsers[n - 1]"
              :items="tempRoles[n - 1].users"
              :rules="[v => !!v.length || 'Trzeba przypisać użytkownika!']"
              item-text="nickname"
              item-value="id"
              label="Użytkownicy"
              return-object
              multiple
              chips
              required
            />
          </v-col>
          <v-col align-self="center">
            <v-btn icon color="primary" @click="onAddRow">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              v-if="n > 1"
              icon
              color="primary"
              @click="onRemoveRow(n - 1)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-checkbox v-model="clone.suspended" label="Zawieszony?" required />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text @click="closeModal()">
        Anuluj
      </v-btn>
      <v-btn :disabled="!valid" color="primary" @click="createProject()">
        Zapisz
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
// import { makeFindMixin } from "feathers-vuex";

export default {
  name: "ProjectsModal",
  props: {
    project: {
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
      tempRoles: [],
      tempUsers: []
    };
  },
  computed: {
    ...mapGetters("role", { findRolesInStore: "find" }),
    roles() {
      return this.findRolesInStore({ query: {} }).data.filter(
        item => item.id !== 1
      );
    },
    isUsersDisabled() {
      return n => {
        return this.tempRoles[n - 1] && !this.tempRoles[n - 1].id;
      };
    }
  },
  created() {
    this.resetForm();
  },
  methods: {
    async createProject() {
      if (this.valid) {
        try {
          this.clone.project_roles = [];
          this.tempRoles.forEach((role, index) => {
            this.clone.project_roles.push({
              order: index + 1,
              role: role,
              users: this.tempUsers[index]
            });
          });
          await this.clone.save();
          this.resetForm();
          this.$emit("close");
        } catch (error) {
          console.error({ error });
          this.$store.dispatch("error-handler/addErrorMessage", {
            message: "Nie udało się utworzyć projektu!"
          });
        }
      }
    },
    resetForm() {
      const Project = this.$FeathersVuex.api.byServicePath.project;
      let projectModel = null;
      if (this.project) {
        projectModel = new Project(this.project);
      } else {
        projectModel = new Project({});
      }
      this.clone = projectModel.clone();
      this.initTempRoles();
      this.initTempUsers();
      if (!this.tempRoles.length) {
        this.onAddRow();
      }
    },
    initTempRoles() {
      if (this.project) {
        this.tempRoles = this.project.project_roles.map(projectRole => ({
          id: projectRole.role.id,
          name: projectRole.role.name,
          users: this.roles.find(role => role.id === projectRole.role.id).users
        }));
      } else {
        this.tempRoles = [];
        this.tempRoles.push(this.roles[0]);
      }
    },
    initTempUsers() {
      if (this.project) {
        this.tempUsers = this.project.project_roles.map(
          projectRole => projectRole.users
        );
      } else {
        this.tempUsers = [];
      }
    },
    closeModal() {
      this.resetForm();
      this.$emit("close");
    },
    onAddRow() {
      this.tempRoles.push(this.roles[0]);
      this.tempUsers.push([]);
    },
    onRemoveRow(index) {
      this.tempRoles.splice(index, 1);
      this.tempUsers.splice(index, 1);
    }
  }
};
</script>

<style></style>
