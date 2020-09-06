import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import auth from "@feathersjs/authentication-client";
import io from "socket.io-client";
import { iff, discard } from "feathers-hooks-common";
import feathersVuex from "feathers-vuex";

const socket = io(
  `${process.env.VUE_APP_SOCKET_HOST}:${process.env.VUE_APP_SOCKET_PORT}`,
  {
    transports: ["websocket"],
    secure: process.env.VUE_APP_SOCKET_SECURE
  }
);

const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage: window.localStorage }))
  .hooks({
    before: {
      all: [
        iff(
          context => ["create", "update", "patch"].includes(context.method),
          discard("__id", "__isTemp")
        )
      ]
    }
  });

export default feathersClient;

// Setting up feathers-vuex
const {
  makeServicePlugin,
  makeAuthPlugin,
  BaseModel,
  models,
  FeathersVuex
} = feathersVuex(feathersClient, {
  serverAlias: "api", // optional for working with multiple APIs (this is the default value)
  idField: "id", // Must match the id field in your database table/collection
  debug: true,
  whitelist: ["$regex", "$options"]
});

export { makeAuthPlugin, makeServicePlugin, BaseModel, models, FeathersVuex };
