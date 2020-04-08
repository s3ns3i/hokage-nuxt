import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class Task extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Task'
  // Define default properties here
  static instanceDefaults() {
    return {
      name: '',
      chapterNo: 0,
      translation: '',
      project: {}
    }
  }
}
const servicePath = 'task'
const servicePlugin = makeServicePlugin({
  Model: Task,
  service: feathersClient.service(servicePath),
  servicePath
})

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [context => {
      const { service } = context
      const { user } = service.FeathersVuexModel.store.state.auth;
      const roleIds = user.roles.map(role => role.id)
      const projectIds = user.user_project_roles.map(userProjectRole => {
        return userProjectRole.project_role.projectId
      })

      context.params.query = {
        roleId: { $in: roleIds },
        projectId: { $in: projectIds },
        userId: { $in: [user.id, 'null'] }
      }
    }],
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