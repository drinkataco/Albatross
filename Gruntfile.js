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
          // AdminLITE CSS/JS
          {
            expand: true,
            src: ['bower_components/admin-lite/dist/css/*'],
            flatten: true,
            dest: 'static/vendor/admin-lite/css'
          },
          {
            expand: true,
            src: ['bower_components/admin-lite/dist/js/*'],
            flatten: true,
            dest: 'static/vendor/admin-lite/js/'
          },
          // Velocity
          {
            expand: true,
            src: ['bower_components/velocity/velocity.min.js'],
            flatten: true,
            dest: 'static/vendor/velocity/js'
          },
          // Bootstrap
          {
            expand: true,
            src: ['bower_components/bootstrap/dist/css/*'],
            flatten: true,
            dest: 'static/vendor/boostrap/css'
          },
          {
            expand: true,
            src: ['bower_components/bootstrap/dist/fonts/*'],
            flatten: true,
            dest: 'static/vendor/boostrap/fonts'
          },
          // Boostrap Native
          {
            expand: true,
            src: ['bower_components/bootstrap.native/dist/bootstrap-native.js'],
            flatten: true,
            dest: 'static/vendor/boostrap.native/js'
          },
          // Font Awesome fonts and CSS
          {
            expand: true,
            src: ['bower_components/font-awesome/css/font-awesome.min.css'],
            flatten: true,
            dest: 'static/vendor/font-awesome/css'
          },
          {
            expand: true,
            src: ['bower_components/font-awesome/fonts/*'],
            flatten: true,
            dest: 'static/vendor/font-awesome/fonts'
          },
          {
            expand: true,
            src: ['bower_components/Ionicons/css/*'],
            flatten: true,
            dest: 'static/vendor/Ionicons/css'
          },
          {
            expand: true,
            src: ['bower_components/Ionicons/fonts/*'],
            flatten: true,
            dest: 'static/vendor/Ionicons/fonts'
          },
          {
            expand: true,
            src: ['bower_components/Ionicons/png/*'],
            flatten: true,
            dest: 'static/vendor/Ionicons/png'
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