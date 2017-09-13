module.exports = function (dir, ext, callback) {
    var fs = require('fs')
    var p = require('path')

    fs.readdir(dir, function (err, data) {
        if(err) {
            return callback(err)
        }
        var ans = []
        for(var i = 0; i < data.length; i++) {
            if(p.extname(data[i]) == '.'+ext)
                //console.log(data[i])
                ans.push(data[i])
        }
        return callback(null, ans)
    })
}