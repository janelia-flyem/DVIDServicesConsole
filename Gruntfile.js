module.exports = function(grunt) {

    // load npm modules at runtime -- cleans up configu file
    require('jit-grunt')(grunt);

  
    // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bootstrap: {
                dest: 'build',
      js: [
              'bootstrap-modal.js'
          ],
      css: [
              'modals.less'
          ]
    },
    less: {
      build: {
        options: {
            paths: ['node_modules/bootstrap/less']
        },
        files: { 'build/css/main.css': 'src/less/main.less'}
      }
    },
    cssmin: {
          build: {
              files: [{
                  expand: true,
                  cwd: 'build/css',
                  src: ['*.css', '!*.min.css'],
                  dest: 'build/css',
                  ext: '.min.css'
              }]
          }
    },
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
        main: {
                files: [
                    {
                        src: 'src/index.html',
                        dest: 'build/example.html'
                    }
                ]
        }
    },
    watch: {
      scripts: {
        files: ['src/index.html', 'src/js/app.js', 'src/js/**/*.js'],
        tasks: ['browserify', 'less', 'uglify', 'cssmin', 'copy']
      }
    }
  });


  // Default task(s).
  grunt.registerTask('default', ['browserify', 'less', 'uglify', 'copy', 'cssmin', 'watch']);

};
