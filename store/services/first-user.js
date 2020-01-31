import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class FirstUser extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'FirstUser'
  // Define default properties here
  static instanceDefaults() {
    return {
      total: '',
    }
  }
}
const servicePath = 'first-user'
const servicePlugin = makeServicePlugin({
  Model: FirstUser,
  service: feathersClient.service(servicePath),
  servicePath
})

export default servicePlugin