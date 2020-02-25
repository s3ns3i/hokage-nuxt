import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class FirstUser extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'User'
  // Define default properties here
  static instanceDefaults() {
    return {
      email: '',
      password: '',
      nickname: ''
    }
  }
}
const servicePath = 'users/first-user'
const servicePlugin = makeServicePlugin({
  Model: FirstUser,
  service: feathersClient.service(servicePath),
  servicePath
})

export default servicePlugin