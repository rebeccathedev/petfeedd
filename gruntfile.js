var glob = require("glob")

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');

    const config = {
        tag: grunt.option.tag || 'latest',
        arch: grunt.option.arch || 'arm32v7',
        image: grunt.option.image || ('peckrob/petfeedd' + (grunt.option.arch || 'arm32v7'))
    }

    const jsPackages = {
        "jquery": "./node_modules/jquery/dist/jquery.min.js",
        "vue": "./node_modules/vue/dist/vue.min.js",
        "vue-router": "./node_modules/vue-router/dist/vue-router.min.js",
        "vue-resource": "./node_modules/vue-resource/dist/vue-resource.min.js",
        "bootstrap-js": "./node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js"
    }

    const sassIncludePaths = [
        './assets/scss',
        './node_modules/bootstrap-sass/assets/stylesheets',
    ];

    var copyJsPackages = [];
    for (const package in jsPackages) {
        if (jsPackages.hasOwnProperty(package)) {
            const path = jsPackages[package];
            copyJsPackages.push({
                expand: true,
                src: path,
                dest: './build/src/static/scripts/',
                flatten: true
            });
        }
    }

    grunt.initConfig({
        shell: {
            clean: {
                command: 'find ./build -maxdepth 1 -not -name ".gitignore" -not -name "build" -exec rm -rf {} \\;'
            }
        },

        sass: {
            options: {
                implementation: require('node-sass'),
                sourceMap: true,
                sourceComments: false,
                outputStyle: "compressed",
                includePaths: sassIncludePaths,
                precision: 5,
                linefeed: "lf"
            },
            dist: {
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: './',
                    src: ['./assets/scss/**/*.scss'],
                    dest: './build/src/static/styles',
                    ext: '.min.css'
                }]
            }
        },
        copy: {
            base: {
                files: [
                    {
                        expand: true,
                        flatten: false,
                        src: './src/*',
                        dest: './build'
                    },
                    {
                        expand: true,
                        flatten: false,
                        src: './*.Dockerfile',
                        dest: './build'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: './assets/js/*',
                        dest: './build/src/static/scripts/'
                    }
                ]
            },
            jsPackages: {
                files: copyJsPackages
            },
        }
    });

    grunt.registerTask('build:docker', function() {
        glob("./*.Dockerfile", null, function (er, files) {
            
        });
    });

    grunt.registerTask('clean', ['shell:clean']);
    grunt.registerTask('build', ['clean', 'copy:base', 'copy:jsPackages', 'sass', 'build:docker']);
    grunt.registerTask('default', ['build']);
}
