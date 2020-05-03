import feathersClient, {
  makeServicePlugin,
  BaseModel
} from "~/plugins/feathers";

class Task extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = "Task";
  static namespace = "task";
  // Define default properties here
  static instanceDefaults() {
    return {
      chapterNo: 0,
      name: "",
      project: {},
      projectId: 0,
      roleId: 0,
      translations: [],
      userId: 0
    };
  }
  // static setupInstance(data, { models }) {
  //   if (data.project) {
  //     data.project = new models.api.Project(data.project);
  //   }
  //   return data;
  // }
}
const servicePath = "task";
const servicePlugin = makeServicePlugin({
  Model: Task,
  service: feathersClient.service(servicePath),
  servicePath,
  handleEvents: {
    created: (item, { model, models }) => {
      const { Project } = models.api;
      Project.store.dispatch("project/find", { query: {} });
      const user = model.store.getters["auth/user"];
      const roleIds = user.roles.map(role => role.id);
      const projectIds = user.user_project_roles.map(userProjectRole => {
        return userProjectRole.project_role.projectId;
      });
      if (
        (item.userId === user.id || item.userId === null) &&
        projectIds.includes(item.projectId) &&
        roleIds.includes(item.roleId)
      ) {
        return true;
      }
      return false;
    },
    patched: async (item, { model, models }) => {
      const { Project } = models.api;
      Project.store.dispatch("project/find", { query: {} });
      const user = model.store.getters["auth/user"];
      const roleIds = user.roles.map(role => role.id);
      const projectIds = user.user_project_roles.map(userProjectRole => {
        return userProjectRole.project_role.projectId;
      });
      if (
        (item.userId === user.id || item.userId === null) &&
        projectIds.includes(item.projectId) &&
        roleIds.includes(item.roleId)
      ) {
        return true;
      }
      return false;
    }
  },
  state: {
    isTaskInProgress: false
  },
  mutations: {
    set_is_task_in_progress(state, { isTaskInProgress }) {
      state.isTaskInProgress = isTaskInProgress;
    }
  },
  actions: {
    setIsTaskInProgress({ commit }, payload) {
      commit("set_is_task_in_progress", payload);
    }
  },
  getters: {
    getIsTaskInProgress: state => state.isTaskInProgress
  }
});

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
});

export default servicePlugin;
