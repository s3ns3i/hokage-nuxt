import feathersClient, {
  makeServicePlugin,
  BaseModel
} from "~/plugins/feathers";

class User extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = "User";
  static namespace = "user";
  // Define default properties here
  static instanceDefaults() {
    return {
      email: "",
      password: "",
      nickname: "",
      emailNotifications: true,
      user_project_roles: []
    };
  }
}

const servicePath = "user";
const servicePlugin = makeServicePlugin({
  Model: User,
  service: feathersClient.service(servicePath),
  servicePath,
  handleEvents: {
    created: (item, { models }) => {
      const { Role } = models.api;
      Role.store.dispatch("role/find", { query: {} });
      return true;
    },
    patched: (item, { models }) => {
      const { Role } = models.api;
      Role.store.dispatch("role/find", { query: {} });
      return true;
    },
    updated: (item, { models }) => {
      const { Role } = models.api;
      Role.store.dispatch("role/find", { query: {} });
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
