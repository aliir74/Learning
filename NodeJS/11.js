var http = require('http')
var fs = require('fs')

var server = http.createServer(function (request, response) {
    var src = fs.createReadStream(process.argv[3])
    src.pipe(response)
})

server.listen(process.argv[2])