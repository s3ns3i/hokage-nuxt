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
  // Define default properties here
  static instanceDefaults() {
    return {
      name: "",
      volumesNo: 0,
      suspended: false,
      project_roles: [],
      tasks: []
    };
  }
}
const servicePath = "project";
const servicePlugin = makeServicePlugin({
  Model: Project,
  service: feathersClient.service(servicePath),
  servicePath
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
