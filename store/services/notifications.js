import feathersClient, {
  makeServicePlugin,
  BaseModel
} from "~/plugins/feathers";

class Notification extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = "Notification";
  static namespace = "notification";
  // Define default properties here
  static instanceDefaults() {
    return {
      text: "",
      userId: 0
    };
  }
}
const servicePath = "notification";
const servicePlugin = makeServicePlugin({
  Model: Notification,
  service: feathersClient.service(servicePath),
  servicePath,
  handleEvents: {
    created: (item, { model }) => {
      const user = model.store.getters["auth/user"];
      if (item.userId === user.id) {
        return true;
      }
      return false;
    },
    removed: (item, { model }) => {
      const user = model.store.getters["auth/user"];
      if (item.userId === user.id) {
        return true;
      }
      return false;
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
