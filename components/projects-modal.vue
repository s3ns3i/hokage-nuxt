<template>
  <v-card>
    <v-card-title class="headline">Dodaj projekt</v-card-title>
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
        <!-- create a select with roles and disabled multiselect with filtered users on the right -->
        <v-row v-for="n in tempRoles.length" :key="n">
          <v-col align-self="center">
            <v-select
              v-model="tempRoles[n - 1].value"
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
              v-model="tempUsers[n - 1].value"
              :items="tempRoles[n - 1] && tempRoles[n - 1].value.users"
              :rules="[v => !!v || 'Trzeba przypisać użytkownika!']"
              :disabled="tempRoles[n - 1] && !tempRoles[n - 1].value"
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
            <v-btn icon color="primary" @click="onAddRow"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
            <v-btn v-if="n > 1" icon color="primary" @click="onRemoveRow(n - 1)"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
          </v-col>
        </v-row>
        <v-text-field v-model="clone.suspended" label="Zawieszony?" required />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="closeModal()">Anuluj</v-btn>
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
  // mixins: [makeFindMixin({ service: "roles" })],
  data() {
    return {
      project: null,
      clone: null,
      valid: false,
      tempRoles: [],
      tempUsers: []
    };
  },
  created() {
    this.resetForm();
  },
  computed: {
    ...mapGetters("roles", { findRolesInStore: "find" }),
    ...mapGetters("users", { findUsersInStore: "find" }),
    roles() {
      return this.findRolesInStore({ query: {} }).data.filter(
        item => item.id !== 1
      );
    },
    users() {
      return this.findUsersInStore({ query: {} }).data;
    },
    rolesNo() {
      return this.tempRoles.length ? this.tempRoles.length + 1 : 1;
    }
  },
  methods: {
    async createProject() {
      if (this.valid) {
        try {
          const project = await this.clone.save();
          this.resetForm();
          this.$emit("close");
        } catch (error) {
          console.error(error);
        }
      }
    },
    resetForm() {
      const Project = this.$FeathersVuex.api.byServicePath.projects;
      this.project = new Project({});
      this.clone = this.project.clone();
      this.clone.roles = [];
      this.clone.users = [];
      this.tempRoles.addElement = function() {
        this.push({
          value: {}
        });
      };
      this.tempUsers.addElement = function() {
        this.push({
          value: []
        });
      };
      this.onAddRow();
    },
    closeModal() {
      this.resetForm();
      this.$emit("close");
    },
    onAddRow() {
      this.tempRoles.addElement();
      this.tempUsers.addElement();
    },
    onRemoveRow(index) {
      this.tempRoles.splice(index, 1);
    },
    isRoleRequired(index) {
      console.log(index);
      return index !== this.tempRoles.length && this.tempRoles.length !== 1;
    }
  }
};
</script>

<style>
</style>