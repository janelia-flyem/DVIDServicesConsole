module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      options: {
        transform:  [ require('grunt-react').browserify ]
      },
      app:          {
        src:        'src/js/app.js',
        dest:       'build/js/bundle.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/js/bundle.js',
        dest: 'build/js/bundle.min.js'
      }
    },
    copy: {
                files: {
                    src: 'src/index.html',
                    dest: 'build/index.html'
                }
    },
    watch: {
      scripts: {
        files: ['src/js/**/*.js'],
        tasks: ['browserify', 'uglify']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['browserify','uglify', 'copy']);

};
