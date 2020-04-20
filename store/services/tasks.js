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
  // Define default properties here
  static instanceDefaults() {
    return {
      name: "",
      chapterNo: 0,
      translation: "",
      project: {}
    };
  }
}
const servicePath = "task";
const servicePlugin = makeServicePlugin({
  Model: Task,
  service: feathersClient.service(servicePath),
  servicePath,
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
