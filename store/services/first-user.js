import feathersClient, {
  makeServicePlugin,
  BaseModel
} from "~/plugins/feathers";

class FirstUser extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = "FirstUser";
  static namespace = "first-user";
  // Define default properties here
  static instanceDefaults() {
    return {
      email: "",
      password: "",
      nickname: ""
    };
  }
}

const servicePath = "user/first-user";
const servicePlugin = makeServicePlugin({
  Model: FirstUser,
  service: feathersClient.service(servicePath),
  servicePath
});

export default servicePlugin;
