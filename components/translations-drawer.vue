<template>
  <div>
    <template v-if="!compact">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              Rozdziały
            </v-list-item-title>
            <v-select v-model="selectedFilter" :items="filters"></v-select>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list :disabled="isTaskInProgress">
        <v-list-item-group v-model="selectedItemIndex" color="primary">
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            two-line
            @click="onItemClick(item)"
          >
            <custom-list-item-content :task="item" />
            <custom-list-item-action :task="tasks[index]" />
          </v-list-item>
        </v-list-item-group>
        <v-list-item>
          <v-list-item-content v-if="!items.length">
            <v-list-item-subtitle>
              Brak rozdziałów
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
    <v-select
      v-else
      v-model="selectedItem"
      :items="items"
      @change="onItemSelect"
    >
      <template v-slot:selection="data">
        <custom-list-item-content :task="data.item" />
        <custom-list-item-action :task="data.item" />
      </template>
      <template v-slot:item="data">
        <template v-if="typeof data.item !== 'object'">
          <v-list-item-content v-text="data.item"></v-list-item-content>
        </template>
        <template v-else>
          <custom-list-item-content :task="data.item" />
          <custom-list-item-action :task="data.item" />
        </template>
      </template>
    </v-select>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CustomListItemContent from "@/components/translations-drawer/custom-list-item-content";
import CustomListItemAction from "@/components/translations-drawer/custom-list-item-action";

export default {
  name: "TranslationsDrawer",
  components: { CustomListItemContent, CustomListItemAction },
  props: {
    compact: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      selectedItem: null,
      selectedItemIndex: -1,
      filters: [
        {
          value: "mine",
          text: "Moje"
        },
        {
          value: "all",
          text: "Wszyskie"
        },
        {
          value: "done",
          text: "Zakończone"
        }
      ],
      selectedFilter: "mine"
    };
  },
  computed: {
    ...mapGetters("task", {
      listTasksFromStore: "list",
      isTaskInProgress: "getIsTaskInProgress"
    }),
    ...mapGetters("auth", ["user"]),
    tasks() {
      const tasks = this.listTasksFromStore;
      let filteredTasks = tasks.filter(
        task => task && this.isUserAssignedToProject(task)
      );
      if (this.selectedFilter === "mine") {
        filteredTasks = filteredTasks.filter(
          task =>
            task &&
            (this.isTaskAssignedToUser(task) || this.isTaskAvailable(task))
        );
      }
      if (this.selectedFilter === "done") {
        filteredTasks = filteredTasks.filter(task => task && !task.roleId);
      }
      return filteredTasks;
    },
    items() {
      return this.tasks.map(task => ({
        value: task.id,
        text: task.name,
        description: `${task.project.name} ${task.chapterNo}`
      }));
    }
  },
  watch: {
    tasks() {
      this.initDrawer();
    }
  },
  mounted() {
    this.initDrawer();
  },
  methods: {
    isUserAssignedToProject(task) {
      return this.user.user_project_roles
        .map(userProjectRole => userProjectRole.project_role.projectId)
        .includes(task.projectId);
    },
    isTaskAssignedToUser(task) {
      const rolesIds = this.user.roles.map(role => role.id);
      return task.userId === this.user.id && rolesIds.includes(task.roleId);
    },
    isTaskAvailable(task) {
      const role = this.user.roles.find(role => role.id === task.roleId);
      return task.userId === null && !!task.roleId && task.roleId === role
        ? !!role.id
        : false;
    },
    onItemClick(item) {
      this.$router.push(`/translations/${item.value}`);
      this.selectedItem = item;
    },
    onItemSelect(value) {
      const index = this.items.findIndex(item => item.value === value);
      this.$router.push(`/translations/${value}`);
      this.selectedItemIndex = index;
    },
    initDrawer() {
      if (this.tasks.length) {
        this.$router.push(`/translations/${this.tasks[0].id}`);
        this.selectedItemIndex = 0;
        this.selectedItem = this.items[0];
      }
    }
  }
};
</script>
