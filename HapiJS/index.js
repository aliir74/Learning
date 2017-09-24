'use strict';

const Hapi = require('hapi')
const db = require('./database').db

const server = new Hapi.Server()

server.connection({port: 3001, host: 'localhost'})

server.route({
    method: 'GET',
    path: '/',
    handler: function (req, res) {
        res('hello world!')
    }
})

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (req, res) {
        res('hello ' + encodeURIComponent(req.params.name))
    }
})

server.start( (err) => {
    if (err) {
        throw err
    }
    console.log(`Server running at: ${server.info.uri}`)
})