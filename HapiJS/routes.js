const Wolf = require('./models/Wolf');


var routes = [
{
    method: 'GET',
    path: '/',
    handler: function (req, res) {
        res('hello world!')
    }
},
{
    method: 'GET',
    path: '/{name}',
    handler: function (req, res) {
        res('hello ' + encodeURIComponent(req.params.name))
    }
}, {
        method: 'GET',
        path: '/',
        handler: function (req, res) {

        }
    }
]

module.exports = routes