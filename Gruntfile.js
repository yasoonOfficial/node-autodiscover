module.exports = function(grunt) {
  var jsFiles = [
    'lib/**/*.js',
    'test/**/*.js'
  ];

  grunt.initConfig({
    watch: {
      scripts: {
        files: jsFiles,
        tasks: ['default']
      }
    },
    simplemocha: {
      options: {
        reporter: 'spec',
        timeout: '5000'
      },
      full: {
        src: ['test/test.js']
      }
    },
    jshint: {
      all: jsFiles,
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('hint', ['jshint']);
  grunt.registerTask('test', ['simplemocha']);
  grunt.registerTask('default', ['hint', 'test']);
};
