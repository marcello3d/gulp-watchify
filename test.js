var fs = require('fs');
var child_process = require('child_process');
var path = require('path');

var examples = fs.readdirSync('./examples').map(function(file){
    return path.join('./examples', file);
}).filter(function (file) {
    return fs.statSync(file).isDirectory();
});

examples.forEach(function(dir) {
    var pwd = process.cwd();

    console.log('Running async gulp child process in ' + dir);
    child_process.exec('gulp', { cwd: dir }, function(err, result) {
        if (err) {
            console.error(dir+' failed')
            throw err
        } else {
            console.log(dir+'\n'+result)
        }
    });
});
