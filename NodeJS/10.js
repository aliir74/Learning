var net = require('net')

var server = net.createServer(function (socket) {
    var data = new Date()
    var min = data.getMonth()+1
    if(min < 10) {
        min = '0' + min
    }

    data = data.getFullYear() + '-' + min + '-' + data.getDate() + ' ' + data.getHours() + ':' + data.getMinutes()
    socket.end(data.toString()+'\n')
})

server.listen(process.argv[2])
