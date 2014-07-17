'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var plumber = require('gulp-plumber');

gulp.task('lint', function () {
  var stream = gulp.src(['./*.js', '!./node_modules/**'])
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('build', ['lint']);

gulp.task('watch', ['lint'], function () {
  gulp.watch('**/*.js', ['scripts']);
});
