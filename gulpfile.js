'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

var jsPackages = {
    "jquery": "./node_modules/jquery/dist/jquery.min.js",
    "vue": "./node_modules/vue/dist/vue.min.js",
    "vue-router": "./node_modules/vue-router/dist/vue-router.min.js",
    "vue-resource": "./node_modules/vue-resource/dist/vue-resource.min.js",
    "bootstrap-js": "./node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js"
}

gulp.task('scss', function () {
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

for (var key in jsPackages) {
    if (jsPackages.hasOwnProperty(key)) {
        (function(key) {
            gulp.task(key, function() {
                return gulp.src(jsPackages[key])
                    .pipe(gulp.dest('./src/static/scripts'));
            });
        })(key);
    }
}

gulp.task('js', function() {
    return gulp.src('./assets/js/**/*.js')
        .pipe(gulp.dest('./src/static/scripts'));
});

gulp.task('scss:watch', function () {
    gulp.watch('./assets/scss/**/*.scss', ['scss']);
});

gulp.task('js:watch', function() {
    gulp.watch('./assets/js/**/*.js', ['js']);
});

gulp.task('watch', ['scss:watch', 'js:watch']);
gulp.task('default', ['scss', 'js'].concat(Object.keys(jsPackages)));
