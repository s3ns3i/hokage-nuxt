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
    patched: (item, { model, models }) => {
      const { User } = models.api;
      User.store.dispatch("user/find", { query: {} });

      const currentUser = model.store.getters["auth/user"];
      const roleIds = currentUser.roles.map(role => role.id);
      const projectIds = currentUser.user_project_roles.map(userProjectRole => {
        return userProjectRole.project_role.projectId;
      });
      const { Task } = models.api;
      Task.store.dispatch("task/find", {
        query: {
          $and: [
            {
              roleId: { $in: roleIds }
            },
            {
              projectId: { $in: projectIds }
            },
            {
              $or: [{ userId: currentUser.id }, { userId: null }]
            }
          ]
        }
      });
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
