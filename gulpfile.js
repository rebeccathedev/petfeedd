'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var exec = require('child_process').execSync;
var glob = require("glob")
var argv = require('yargs').argv;

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

gulp.task('build:clean', function() {
    exec('find ./build -maxdepth 1 -not -name ".gitignore" -not -name "build" -exec rm -rf {} \\;');
});

gulp.task('build', ['build:clean'], function() {
    glob("./Dockerfile.*", null, function (er, files) {
        var image = (argv.image  === undefined) ? "peckrob/petfeedd" : argv.image;
        var tag = (argv.tag  === undefined) ? "latest" : argv.tag;
        var arch = (argv.arch  === undefined) ? null : argv.arch;

        var build = [
            'cp -r src assets node_modules package* gulpfile.js Pipfile* Dockerfile* build/',
            'cd build && gulp && rm -rf node_modules assets gulpfile.js package*',
        ];

        for (const id in files) {
            if (files.hasOwnProperty(id)) {
                const file = files[id];
                var matches = file.match(/Dockerfile\.(.*)/);

                if (matches.length == 2) {
                    if (arch == null || matches[1] == arch) {
                        build.push('cd build && docker build -f ' + file + ' --tag ' + image + '-' + matches[1] + ':' + tag + ' .');
                    }
                }
            }
        }

        for (const elem in build) {
            if (build.hasOwnProperty(elem)) {
                const command = build[elem];
                console.log('Running ' + command);
                exec(command, {stdio: 'inherit'});
            }
        }

        gulp.start('build:clean');
    });
});

gulp.task('watch', ['scss:watch', 'js:watch']);
gulp.task('default', ['scss', 'js'].concat(Object.keys(jsPackages)));
