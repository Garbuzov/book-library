module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'js/**/*.js'],
      options: {
        reporter: require('jshint-stylish'),
        scripturl: true,
        globals: {
          jQuery: true,
          console: true
        }
      }
    },
    concat: {
      options: {
        separator: ''
      },
      dist : {
        src: ['js/models/*.js', 'js/collections/*.js', 'js/views/*.js', 'js/*.js'],
        dest: 'public/js/app.js'
      }
    },
    uglify : {
      my_target: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        files: {
          'public/js/app.min.js' : ['public/js/app.js']
        }
      }
    },

    watch: {
      files: ['js/**/*.js', 'js/*.js'],
      tasks:  ['concat', 'jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('test', ['concat', 'jshint', 'qunit']);
  grunt.registerTask('default', ['concat', 'jshint', 'uglify']);

};