module.exports = function(grunt) {
    'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Common tasks when watching
    watch: {

    },
    // Tasks to 'compile' project with bower components
    copy: {
      main: {
        files: [
          {
            expand: true,
            src: ['bower_components/admin-lite/dist/css/AdminLTE.min.css'],
            cwd: 'src',
            dest: 'static/vendor/admin-lite/'
          },
        ],
      },
    },
  });

  // Load Grunt tasks
  // Watch File Changes
  grunt.loadNpmTasks('grunt-contrib-watch')
  // Copy files
  grunt.loadNpmTasks('grunt-contrib-copy')

  // The default task (running 'grunt' in console) is 'watch'
  grunt.registerTask('default', ['watch'])

  // Copy task, to move from bower_components to /static/vendor
  grunt.registerTask('setup', ['copy'])
}