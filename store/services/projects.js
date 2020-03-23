import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class Project extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Project'
  // Define default properties here
  static instanceDefaults() {
    return {
      name: '',
      volumesNo: 0,
      suspended: false
    }
  }

  // // Mapping roles to the user.
  // static setupInstance(data, { models }) {
  //   if (data.users) {
  //     data.users = data.users.map(user => new models.api.User(user))
  //   }
  //   return data
  // }
}
const servicePath = 'projects'
const servicePlugin = makeServicePlugin({
  Model: Project,
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