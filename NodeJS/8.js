var bl = require('bl')
var http = require('http')

http.get(process.argv[2], function (response) {
    response.pipe(bl(function (err, data) {
        str = data.toString()
        console.log(str.length)
        console.log(str)
    }))
}).on('error', console.error)