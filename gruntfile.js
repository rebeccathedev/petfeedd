var glob = require("glob");

module.exports = function (grunt) {
  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-webpack");

  const config = {
    tag: grunt.option.tag || "latest",
    arch: grunt.option.arch || "arm32v7",
    image:
      grunt.option.image ||
      "peckrob/petfeedd" + (grunt.option.arch || "arm32v7"),
  };

  grunt.initConfig({
    shell: {
      clean: {
        command:
          'find ./build -maxdepth 1 -not -name ".gitignore" -not -name "build" -exec rm -rf {} \\;',
      },
      npm: {
        command: "cd build && npm ci",
      },
      serve: {
        command: "node build/src/index.js",
      },
    },
    webpack: {
      vue: require("./webpack.config"),
    },
    copy: {
      base: {
        files: [
          {
            expand: true,
            flatten: false,
            cwd: "./src/petfeedd-node/",
            src: "**",
            dest: "./build/src",
          },
          {
            expand: true,
            flatten: false,
            src: "./*.Dockerfile",
            dest: "./build",
          },
          {
            expand: true,
            flatten: false,
            src: "./package*.json",
            dest: "./build",
          },
        ],
      },
    }
  });

  grunt.registerTask("watch", function () {
    grunt.renameTask("watch", "foo");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.config.set("watch", {
      vue: {
        files: "src/petfeedd-vue/**/*",
        tasks: "webpack",
      },
      node: {
        files: "src/petfeedd-node/**/*",
        tasks: "copy:base",
      }
    });

    grunt.task.run("watch");
  });

  grunt.registerTask("build", ["clean", "copy:base", "webpack", "shell:npm"]);
  grunt.registerTask("serve", ["shell:serve"]);

  grunt.registerTask("build:docker", function () {
    glob("./*.Dockerfile", null, function (er, files) {});
  });

  grunt.registerTask("clean", ["shell:clean"]);
  grunt.registerTask("default", ["build"]);
};
