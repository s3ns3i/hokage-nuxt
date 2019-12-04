import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class FirstUse extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'User'
  // Define default properties here
  static instanceDefaults() {
    return {
      total: '',
    }
  }
}
const servicePath = 'first-use'
const servicePlugin = makeServicePlugin({
  Model: FirstUse,
  service: feathersClient.service(servicePath),
  servicePath
})

export default servicePlugin