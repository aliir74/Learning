'use strict';

const Hapi = require('hapi')
const db = require('./database').db
const routes = require('./routes')
const Basic = require('hapi-auth-basic')
const Bcrypt = require('bcrypt')
const User = require('./models/User')

const server = new Hapi.Server()

server.connection({port: 3001, host: 'localhost'})

const validate = function (req, username, password, callback) {
    User.find({username: username}, function (err, user) {
        if (!user) {
            return callback(null, false)
        }
        Bcrypt.compare(password, user.password, (err, isValid) => {
            callbak(err, isValid, {id: user._id, username: user.username})
        })
    })
}

server.register(Basic, (err) => {
    if (err) {
        throw err
    }

    server.auth.strategy('simple', 'basic', {validateFunc: validate})

    //server.route(routes)
    server.route({
        method: 'GET',
        path: '/',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                reply('hello, ' + request.auth.credentials.name);
            }
        }
    });

    server.start( (err) => {
        if (err) {
            throw err
        }
        console.log(`Server running at: ${server.info.uri}`)
    })
})



