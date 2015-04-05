var gutil = require('gulp-util')
var merge = require('deepmerge')
var through = require('through2')
var browserify = require('browserify')
var watchify = require('watchify')

var cache = {}

module.exports = function(taskCallback) {

    function getBundle(file, opt) {
        var path = file.path
        if (cache[path]) {
            return cache[path]
        }
        if (opt.watch !== false) {
            opt = merge(opt, watchify.args)
        }
        var bundle = browserify(opt)
        if (opt.watch !== false) {
            bundle = watchify(bundle, opt) // modifies bundle to emit update events
            cache[path] = bundle
            bundle.on('update', function() {
                bundle.updateStatus = 'updated'
                taskCallback(plugin)
            })
        }
        bundle.updateStatus = 'first'
        if (opt.setup) {
            opt.setup(bundle)
        }

        return bundle
    }
    function plugin(opt) {
        return through.obj(function(file, enc, callback){
            if (file.isNull()) {
                this.push(file) // Do nothing if no contents
                return callback()
            }
            if (file.isStream()) {
                return callback(new Error('gulp-watchify ignores streams'))
            }
            var options = merge(opt, { entries:'./'+file.relative, basedir:file.base })
            var bundle = getBundle(file, options)
            if (bundle.updateStatus) {
                gutil.log(
                    bundle.updateStatus === 'first' ? "Bundling" : "Rebundling",
                    gutil.colors.magenta(file.relative),
                    opt.watch !== false ? '(watch mode)':''
                )
                file = file.clone()
                delete bundle.updateStatus
                file.contents = bundle.bundle()
                // Wait until done or else streamify(uglify()) fails due to buffering
                file.contents.on('error', callback)
                file.contents.on('end', callback)
                this.push(file)
            } else {
                callback()
            }
        })
    }
    // Return wrapped Task
    return function() {
        return taskCallback(plugin)
    }
}