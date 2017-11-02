// AdminLite Gruntfile
module.exports = function (grunt) { // jshint ignore:line
  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      less: {
        // Compiles less files upon saving
        files: ['build/less/*.less'],
        tasks: ['less:development', 'less:production', 'replace', 'notify:less']
      },
      js: {
        // Compile js files upon saving
        files: ['build/js/*.js'],
        tasks: ['js', 'notify:js']
      },
      skins: {
        // Compile any skin less files upon saving
        files: ['build/less/skins/*.less'],
        tasks: ['less:skins', 'less:minifiedSkins', 'notify:less']
      }
    },
    // Notify end of tasks
    notify: {
      less: {
        options: {
          title: 'AdminLite',
          message: 'LESS finished running'
        }
      },
      js: {
        options: {
          title: 'AdminLit',
          message: 'JS bundler finished running'
        }
      }
    },
    // 'less'-task configuration
    // This task will compile all less files upon saving to create both AdminLTE.css and AdminLTE.min.css
    less: {
      // Development not compressed
      development: {
        files: {
          // compilation.css  :  source.less
          'dist/css/AdminLTE.css': 'build/less/AdminLTE.less'
        }
      },
      // Production compressed version
      production: {
        options: {
          compress: true
        },
        files  : {
          // compilation.css  :  source.less
          'dist/css/AdminLTE.min.css': 'build/less/AdminLTE.less'
        }
      },
      // Non minified skin files
      skins: {
        files: {
          'dist/css/skins/skin-blue.css': 'build/less/skins/skin-blue.less',
          'dist/css/skins/skin-black.css': 'build/less/skins/skin-black.less',
          'dist/css/skins/skin-yellow.css': 'build/less/skins/skin-yellow.less',
          'dist/css/skins/skin-green.css': 'build/less/skins/skin-green.less',
          'dist/css/skins/skin-red.css': 'build/less/skins/skin-red.less',
          'dist/css/skins/skin-purple.css': 'build/less/skins/skin-purple.less',
          'dist/css/skins/skin-blue-light.css': 'build/less/skins/skin-blue-light.less',
          'dist/css/skins/skin-black-light.css': 'build/less/skins/skin-black-light.less',
          'dist/css/skins/skin-yellow-light.css': 'build/less/skins/skin-yellow-light.less',
          'dist/css/skins/skin-green-light.css': 'build/less/skins/skin-green-light.less',
          'dist/css/skins/skin-red-light.css': 'build/less/skins/skin-red-light.less',
          'dist/css/skins/skin-purple-light.css': 'build/less/skins/skin-purple-light.less',
          'dist/css/skins/_all-skins.css': 'build/less/skins/_all-skins.less'
        }
      },
      // Skins minified
      minifiedSkins: {
        options: {
          compress: true
        },
        files  : {
          'dist/css/skins/skin-blue.min.css': 'build/less/skins/skin-blue.less',
          'dist/css/skins/skin-black.min.css': 'build/less/skins/skin-black.less',
          'dist/css/skins/skin-yellow.min.css': 'build/less/skins/skin-yellow.less',
          'dist/css/skins/skin-green.min.css': 'build/less/skins/skin-green.less',
          'dist/css/skins/skin-red.min.css': 'build/less/skins/skin-red.less',
          'dist/css/skins/skin-purple.min.css': 'build/less/skins/skin-purple.less',
          'dist/css/skins/skin-blue-light.min.css': 'build/less/skins/skin-blue-light.less',
          'dist/css/skins/skin-black-light.min.css': 'build/less/skins/skin-black-light.less',
          'dist/css/skins/skin-yellow-light.min.css': 'build/less/skins/skin-yellow-light.less',
          'dist/css/skins/skin-green-light.min.css': 'build/less/skins/skin-green-light.less',
          'dist/css/skins/skin-red-light.min.css': 'build/less/skins/skin-red-light.less',
          'dist/css/skins/skin-purple-light.min.css': 'build/less/skins/skin-purple-light.less',
          'dist/css/skins/_all-skins.min.css': 'build/less/skins/_all-skins.less'
        }
      }
    },

    // Uglify task info. Compress the js files.
    uglify: {
      options: {
        mangle: true,
        preserveComments: 'some'
      },
      production: {
        files: {
          'dist/js/adminlite.min.js': ['dist/js/adminlite.js'],
          'dist/js/adminlite.babel.min.js': ['dist/js/adminlite.babel.js'],
        }
      }
    },

    // Convert from ES6
    babel: {
      options: {
        sourceMap: true,
        presets: ['env']
      },
      dist: {
        files: {
          'dist/js/adminlite.babel.js': 'dist/js/adminlite.js'
        }
      }
    },

    // Concatenate JS Files
    concat: {
      options: {
        separator: '\n\n',
        banner: '/*! Albatross app.js\n'
        + '* ================\n'
        + '* Development'
        + '*\n'
        + '* @Author  Josh Walwyn\n'
        + '*/\n\n'
        + 'const runner = [];\n\n'
        + 'window.onload = () => runner.map(run => run());\n\n'
      },
      dist: {
        src: [
          'build/js/Utilities.js',
          'build/js/Tree.js',
          'build/js/PushMenu.js',
          'build/js/Layout.js',
          'build/js/ControlSidebar.js',
          'build/js/BoxRefresh.js',
          'build/js/BoxWidget.js',
          'build/js/DirectChat.js',
          'build/js/TodoList.js',
        ],
        dest: 'dist/js/adminlite.js'
      }
    },

    // Optimize images
    image: {
      dynamic: {
        files: [
          {
            expand: true,
            cwd: 'build/img/',
            src: ['**/*.{png,jpg,gif,svg,jpeg}'],
            dest: 'dist/img/'
          }
        ]
      }
    },

    // Validate JS code
    eslint: {
      options: {
          configFile: 'build/js/.eslintrc.json'
      },
      target: ['build/js/*']
    },

    // Validate CSS files
    csslint: {
      options: {
        csslintrc: 'build/less/.csslintrc'
      },
      dist: [
        'dist/css/AdminLTE.css'
      ]
    },

    // Validate Bootstrap HTML
    bootlint: {
      options: {
        relaxerror: ['W005']
      },
      files: ['pages/**/*.html', '*.html']
    },

    // Delete images in build directory
    // After compressing the images in the build/img dir, there is no need
    // for them
    clean: {
      build: ['build/img/*']
    }
  })

  // Load all grunt tasks

  // LESS Compiler
  grunt.loadNpmTasks('grunt-contrib-less')
  // Watch File Changes
  grunt.loadNpmTasks('grunt-contrib-watch')
  // Compress JS Files
  grunt.loadNpmTasks('grunt-contrib-uglify')
  // Include Files Within HTML
  grunt.loadNpmTasks('grunt-includes')
  // Optimize images
  grunt.loadNpmTasks('grunt-image')
  // Validate JS code
  grunt.loadNpmTasks('grunt-eslint')
  // Delete not needed files
  grunt.loadNpmTasks('grunt-contrib-clean')
  // Lint CSS
  grunt.loadNpmTasks('grunt-contrib-csslint')
  // Lint Bootstrap
  grunt.loadNpmTasks('grunt-bootlint')
  // Concatenate JS files
  grunt.loadNpmTasks('grunt-contrib-concat')
  // Notify
  grunt.loadNpmTasks('grunt-notify')
  // Replace
  grunt.loadNpmTasks('grunt-text-replace')

  // Linting task
  grunt.registerTask('lint', ['eslint', 'csslint', 'bootlint'])
  // JS task
  //grunt.registerTask('js', ['concat', 'uglify'])
  grunt.registerTask('js', ['concat', 'babel', 'uglify'])
  // CSS Task
  grunt.registerTask('css', ['less:development', 'less:production', 'replace'])

  // Task for building with travis
  grunt.registerTask('travis', ['eslint', 'csslint']);

  // The default task (running 'grunt' in console) is 'watch'
  grunt.registerTask('default', ['watch'])
}
