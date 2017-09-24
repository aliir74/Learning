const Hapi = require('hapi')
const db = require('./database').db
const routes = require('./routes')
const Basic = require('hapi-auth-basic')
const User = require('./models/User')
const Wolf = require('./models/Wolf')
const server = new Hapi.Server()

const home = function (request, reply) {

    reply('<html><head><title>Login page</title></head><body><h3>Welcome ' +
        request.auth.credentials.name +
        '!</h3><br/><form method="get" action="/logout">' +
        '<input type="submit" value="Logout">' +
        '</form></body></html>');
};


Wolf.find(function (err, users) {
    let uuid = 1

    const login = function (request, reply) {

        if (request.auth.isAuthenticated) {
            return reply.redirect('/');
        }

        let message = '';
        let account = null;

        if (request.method === 'post') {

            if (!request.payload.username ||
                !request.payload.password) {

                message = 'Missing username or password';
            }
            else {
                account = users.find(function(e) {
                    return request.payload.username === e.name
                });
                console.log(account)
                console.log(users)
                if (!account) {

                    message = 'Invalid username or password';
                }
            }
        }

        if (request.method === 'get' ||
            message) {

            return reply('<html><head><title>Login page</title></head><body>' +
                (message ? '<h3>' + message + '</h3><br/>' : '') +
                '<form method="post" action="/login">' +
                'Username: <input type="text" name="username"><br>' +
                'Password: <input type="password" name="password"><br/>' +
                '<input type="submit" value="Login"></form></body></html>');
        }

        const sid = String(++uuid);
        request.server.app.cache.set(sid, { account: account }, 0, (err) => {

            if (err) {
                reply(err);
            }

            request.cookieAuth.set({ sid: sid });
        return reply.redirect('/');
    });
    };

    const logout = function (request, reply) {

        request.cookieAuth.clear();
        return reply.redirect('/');
    };

    const server = new Hapi.Server();
    server.connection({ port: 8000 });

    server.register(require('hapi-auth-cookie'), (err) => {

        if (err) {
            throw err;
        }

        const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
        server.app.cache = cache;

        server.auth.strategy('session', 'cookie', true, {
            password: 'password-should-be-32-characters',
            cookie: 'sid-example',
            redirectTo: '/login',
            isSecure: false,
            validateFunc: function (request, session, callback) {

                cache.get(session.sid, (err, cached) => {

                    if (err) {
                        return callback(err, false);
                    }

                    if (!cached) {
                    return callback(null, false);
                }

                return callback(null, true, cached.account);
            });
            }
        });

        server.route([
            { method: 'GET', path: '/', config: { handler: home } },
            { method: ['GET', 'POST'], path: '/login', config: { handler: login, auth: { mode: 'try' }, plugins: { 'hapi-auth-cookie': { redirectTo: false } } } },
            { method: 'GET', path: '/logout', config: { handler: logout } }
        ]);

        server.start(() => {

            console.log('Server ready');
        });
    });
})



