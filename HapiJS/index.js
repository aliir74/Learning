'use strict';

const Hapi = require('hapi')
const db = require('./database').db
const routes = require('./routes')

const server = new Hapi.Server()

server.connection({port: 3001, host: 'localhost'})

server.route(routes)

server.start( (err) => {
    if (err) {
        throw err
    }
    console.log(`Server running at: ${server.info.uri}`)
})