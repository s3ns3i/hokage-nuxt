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
      project: {},
      projectId: 0
    };
  }
}
const servicePath = "task";
const servicePlugin = makeServicePlugin({
  Model: Task,
  service: feathersClient.service(servicePath),
  servicePath,
  handleEvents: {
    created: (item, { model, models }) => {
      console.log("created handleEvents");
      options.enableEvents;
    },
    patched: (item, { model, models }) => {
      console.log("patched handleEvents");
      options.enableEvents;
    },
    updated: (item, { model, models }) => {
      console.log("updated handleEvents");
      options.enableEvents;
    },
    removed: (item, { model, models }) => {
      console.log("removed handleEvents");
      options.enableEvents;
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
    // afterFind({ rootState }, response) {
    //   const { user } = rootState.auth;
    //   if (user) {
    //     const roleIds = user.roles.map(role => role.id);
    //     const projectIds = user.user_project_roles.map(userProjectRole => {
    //       return userProjectRole.project_role.projectId;
    //     });
    //     return getters.find({
    //       query: {
    //         roleId: { $in: roleIds },
    //         projectId: { $in: projectIds },
    //         $or: [{ userId: user.id }, { userId: null }]
    //       }
    //     }).data;
    //   }
    //   return [];
    // }
    setIsTaskInProgress({ commit }, payload) {
      commit("set_is_task_in_progress", payload);
    }
  },
  getters: {
    getIsTaskInProgress: state => state.isTaskInProgress
    // getAvailableTasks: (state, getters, rootState, rootGetters) => {
    //   const { user } = rootState.auth;
    //   if (user) {
    //     const roleIds = user.roles.map(role => role.id);
    //     const projectIds = user.user_project_roles.map(userProjectRole => {
    //       return userProjectRole.project_role.projectId;
    //     });
    //     return getters.find({
    //       query: {
    //         roleId: { $in: roleIds },
    //         projectId: { $in: projectIds },
    //         $or: [{ userId: user.id }, { userId: null }]
    //       }
    //     }).data;
    //   }
    //   return [];
    // }
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
