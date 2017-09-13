var http = require('http')
var url = require('url')

var server = http.createServer(function (request, response) {
    if(request.url.split('/')[2].slice(0,9) == 'parsetime') {
        var query = url.parse(request.url, true).query
        var data = query.iso
        var date = new Date(data)
        response.end(JSON.stringify({
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds()
        })+'\n')

    } else {
        var query = url.parse(request.url, true).query
        var data = query.iso
        var date = new Date(data)
        response.end(JSON.stringify({
            unixtime: date.getTime()
        })+'\n')
    }
})

server.listen(process.argv[2])