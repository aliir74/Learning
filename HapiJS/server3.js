const Hapi = require('hapi')
const db = require('./database').db
const routes = require('./routes')
const User = require('./models/User')
const Wolf = require('./models/Wolf')
var CookieAuth = require('hapi-auth-cookie')

// create new server instance
var server = new Hapi.Server()
server.connection({ port: 8000, routes: {cors: true} });

Wolf.find(function (err, users) {
// register plugins to server instance
    server.register(CookieAuth, function (err) {

        server.auth.strategy('session', 'cookie', {
            password: 'm!*"2/),p4:xDs%KEgVr7;e#85Ah^WYC'
        }) // your TODO: options -> there are required ones

        server.route({
            method: 'GET',
            path: '/private-route',
            config: {
                auth: 'session',
                handler: function (request, reply) {
                    reply('Yeah! This message is only available for authenticated users!')
                }
            }
        })

        server.route({
            method: 'POST',
            path: '/login',
            config: {
                cors: {
                    origin: ['*'],
                    additionalHeaders: ['cache-control', 'x-requested-with']
                },
                handler: function (request, reply) {
                    var username = (request.payload).username
                    var password = (request.payload).password
                    console.log(users)
                    console.log(request.payload)

                    user = users.find(function(e) {
                        return username === e.name
                    });

                    console.log(user)
                    request.cookieAuth.set({username: user.name});

                    reply('Wohoo, great to see you: ')
                }
            }
        })

        server.route({
            method: 'GET',
            path: '/',
            config: {
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                handler: function (request, reply) {
                    if (request.auth.isAuthenticated) {
                        // session data available
                        var session = request.auth.credentials

                        return reply('Bro, you’re already authenticated :)' + session)
                    } else {
                        return reply(':|')
                    }
                }
            }
        })

        server.route({
            method: 'GET',
            path: '/logout',
            config: {
                auth: 'session',
                handler: function (request, reply) {
                    // clear the session data
                    request.cookieAuth.clear()

                    reply('Logged out. See you around :)')
                }
            }
        })

        // start your server after plugin registration
        server.start(function (err) {
            console.log('info', 'Server running at: ' + server.info.uri)
        })
    })
})