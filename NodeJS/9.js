var http = require('http')
var bl = require('bl')

var url = [process.argv[2], process.argv[3], process.argv[4]]
var data = [0, 1, 2]

let cnt = 0

function test() {
    for(var i = 0; i < 3; i++) {
        console.log(data[i])
    }
}

function test2(i) {
    http.get(url[i], function (response) {
        response.pipe(bl(function (err, res) {
            data[i] = res.toString()
            cnt += 1
            //console.log(cnt)
            if(cnt === 3) {
                //console.log(data)
                test()
            }
        }))
    })
}


for(var i = 0; i < 3; i++) {
    test2(i)
}

