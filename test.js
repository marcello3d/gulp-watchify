var fs = require('fs');
var sys = require('sys');
var exec = require('exec-sync');
var child;
var path = require('path');

var examples = fs.readdirSync('./examples').map(function(file){
  return path.join('./examples', file);
}).filter(function (file) {
  return fs.statSync(file).isDirectory();
});

examples.forEach(function(dir) {
  var pwd = process.cwd();
  process.chdir(dir);

  console.log('Running: ' + dir);
  exec('gulp');

  process.chdir(pwd);
});
