import feathersClient, {
  makeServicePlugin,
  BaseModel
} from "~/plugins/feathers";

class UsersProjects extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = "UsersProjects";
  static namespace = "users-projects";
  // Define default properties here
  static instanceDefaults() {
    return {
      nickname: "",
      roles: [],
      projects: []
    };
  }
}

const servicePath = "user/users-projects";
const servicePlugin = makeServicePlugin({
  Model: UsersProjects,
  service: feathersClient.service(servicePath),
  servicePath
});

export default servicePlugin;
