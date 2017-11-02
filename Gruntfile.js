module.exports = function(grunt) {
    'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Common tasks when watching
    watch: {

    },
    // Tasks to 'compile' project with bower components
    compile: {

    }
  });

  // Load Grunt tasks
  // Watch File Changes
  grunt.loadNpmTasks('grunt-contrib-watch')

  // The default task (running 'grunt' in console) is 'watch'
  grunt.registerTask('default', ['watch'])
}