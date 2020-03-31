import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class UserProjectRole extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'UserProjectRole'
  // Define default properties here
  static instanceDefaults() {
    return {}
  }

  // // Mapping roles to the userProjectRole.
  // static setupInstance(data, { models }) {
  //   if (data.roles) {
  //     data.roles = data.roles.map(role => new models.api.Role(role))
  //   }
  //   return data
  // }
}
const servicePath = 'user-project-role'
const servicePlugin = makeServicePlugin({
  Model: UserProjectRole,
  service: feathersClient.service(servicePath),
  servicePath
})

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
})

export default servicePlugin