const Hapi = require('hapi')
const db = require('./database').db
const routes = require('./routes')
const Basic = require('hapi-auth-basic')
const User = require('./models/User')
const Wolf = require('./models/Wolf')
const server = new Hapi.Server()

server.connection({port: 3001, host: 'localhost'})

const validate = function (decoded, req, callback) {
    /* User.find({username: req.params.username, password: req.params.password}, function (err, user) {
        if (!user) {
            return callback(null, false)
        }
        return callback(null, true)
    }) */
    Wolf.find({name: req.params.name}, function (err, wolf) {
        if (!wolf) {
            return callback(null, false)
        }
        return callback(null, true)
    })

}



server.register(require('hapi-auth-jwt2'), function (err) {
    if (err) {
        console.error(err)
    }

    server.auth.strategy('jwt', 'jwt', {
        key: 'NeverShareYourSecret',
        validateFunc: validate,
        verifyOptions: { algorithms: [ 'HS256' ] }
    })
    server.auth.default('jwt');

    server.route([
        {
            method: "GET", path: "/", config: { auth: false },
            handler: function(request, reply) {
                reply({text: 'Token not required'});
            }
        },
        {
            method: 'GET', path: '/restricted', config: { auth: 'jwt' },
            handler: function(request, reply) {
                reply({text: 'You used a Token!'})
                    .header("Authorization", request.headers.authorization);
            }
        }
    ]);

    server.start( (err) => {
        if (err) {
            throw err
        }
        console.log(`Server running at: ${server.info.uri}`)
})
})
