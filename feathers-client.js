import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth, { MemoryStorage } from '@feathersjs/authentication-client'
import { CookieStorage } from 'cookie-storage'
import io from 'socket.io-client'
import { iff, discard } from 'feathers-hooks-common'
import feathersVuex from 'feathers-vuex'

const socket = io('http://localhost:3030', { transports: ['websocket'] })

const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(auth({
    storage: process.server
      ? new MemoryStorage() : new CookieStorage()
  }))
  .hooks({
    before: {
      all: [
        iff(
          context => ['create', 'update', 'patch'].includes(context.method),
          discard('__id', '__isTemp')
        )
      ]
    }
  })

export default feathersClient

// Setting up feathers-vuex
const { makeServicePlugin, makeAuthPlugin, BaseModel, models, FeathersVuex } = feathersVuex(
  feathersClient,
  {
    serverAlias: 'api', // optional for working with multiple APIs (this is the default value)
    idField: '_id', // Must match the id field in your database table/collection
    whitelist: ['$regex', '$options'],
    enableEvents: process.client
  }
)

export { makeAuthPlugin, makeServicePlugin, BaseModel, models, FeathersVuex }
