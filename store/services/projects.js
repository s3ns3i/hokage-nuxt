import feathersClient, {
  makeServicePlugin,
  BaseModel
} from "~/plugins/feathers";

class Project extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = "Project";
  static namespace = "project";
  // Define default properties here
  static instanceDefaults() {
    return {
      name: "",
      project_roles: [],
      suspended: false,
      tasks: [],
      volumesNo: 0
    };
  }
}
const servicePath = "project";
const servicePlugin = makeServicePlugin({
  Model: Project,
  service: feathersClient.service(servicePath),
  servicePath,
  handleEvents: {
    created: (item, { models }) => {
      const { User } = models.api;
      User.store.dispatch("user/find", { query: {} });
      return true;
    },
    patched: (item, { models }) => {
      const { User } = models.api;
      User.store.dispatch("user/find", { query: {} });
      return true;
    },
    updated: (item, { models }) => {
      const { User } = models.api;
      User.store.dispatch("user/find", { query: {} });
      return true;
    }
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
