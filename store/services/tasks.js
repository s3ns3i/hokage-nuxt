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
}
const servicePath = "task";
const servicePlugin = makeServicePlugin({
  Model: Task,
  service: feathersClient.service(servicePath),
  servicePath,
  handleEvents: {
    created: (item, { models }) => {
      const { Project, UsersProjects } = models.api;
      Project.store.dispatch("project/find", { query: {} });
      UsersProjects.store.dispatch("users-projects/find", { query: {} });
      // keyedById is broken
      // it adds a record event if this returns false
      // needs to be reported
      return true;
    },
    patched: (item, { models }) => {
      const { UsersProjects } = models.api;
      UsersProjects.store.dispatch("users-projects/find", { query: {} });
      return true;
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
