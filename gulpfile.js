'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('./assets/scss/**/*.scss')
        .pipe(sass({
            style: 'compressed',
            includePaths: [
                 './assets/scss',
                 './node_modules/bootstrap-sass/assets/stylesheets',
             ]
        })
        .on('error', sass.logError))
        .pipe(gulp.dest('./src/static/styles'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('default', ['sass']);
