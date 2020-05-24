import feathersClient, {
  makeServicePlugin,
  BaseModel
} from "~/plugins/feathers";

class Role extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = "Role";
  static namespace = "role";
  // Define default properties here
  static instanceDefaults() {
    return {
      name: "",
      users: []
    };
  }
}
const servicePath = "role";
const servicePlugin = makeServicePlugin({
  Model: Role,
  service: feathersClient.service(servicePath),
  servicePath,
  handleEvents: {
    patched: (item, { models }) => {
      const { User, UsersProjects } = models.api;
      User.store.dispatch("user/find", { query: {} });
      UsersProjects.store.dispatch("users-projects/find", { query: {} });
      return true;
    },
    updated: (item, { models }) => {
      const { User, UsersProjects } = models.api;
      User.store.dispatch("user/find", { query: {} });
      UsersProjects.store.dispatch("users-projects/find", { query: {} });
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
