'use strict';
module.exports = function(grunt) {

  // load all tasks
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: [
        'Gruntfile.js',
        'src/coffee/*.coffee',
        'src/coffee/**/*.coffee',
        'src/sass/*.scss',
        'src/sass/**/*.scss'
      ],
      tasks: [
        // 'sass:dev',
        'coffee:compile'
      ],
      options: {
        livereload: true,
      },
    },
    // sass: {
    //   dev: {
    //     options : {
    //       style : 'expanded'
    //     },
    //     files: {
    //       'style.css':'assets/styles/src/style.scss',
    //     }
    //   },
    //   release: {
    //     options : {
    //       style : 'expanded'
    //     },
    //     files: {
    //       'style.css':'assets/styles/src/style.scss',
    //     }
    //   },
    // },
    coffee: {
      compile: {
        options: {
          bare: true,
          sourceMap: true
        },
        expand: true,
        flatten: false,
        src: [
          '*.coffee',
          '**/*.coffee'
        ],
        cwd: 'src/coffee',
        dest: 'scripts',
        ext: '.js'
      }
    },
    // autoprefixer: {
    //   options: {
    //     browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'ie 9']
    //   },
    //   single_file: {
    //     src: 'style.css',
    //     dest: 'style.css'
    //   }
    // },
    // csscomb: {
    //   options: {
    //       config: '.csscomb.json'
    //   },
    //   files: {
    //       'style.css': ['style.css'],
    //   }
    // },
    // concat: {
    //   css: {
    //     src: [
    //       'assets/styles/vendor/bootstrap.css',
    //       'assets/styles/vendor/ionicons.min.css'
    //     ],
    //     dest: 'assets/styles/vendor.min.css'
    //   },
    //   js: {
    //     src: [
    //       'assets/js/src/skip-link-focus-fix.js',
    //       'assets/js/src/navigation.js'
    //     ],
    //     dest: 'assets/js/theme.min.js'
    //   },
    //   vendor_js: {
    //     src: [
    //       'assets/js/vendor/jquery.min.js',
    //       'assets/js/vendor/bootstrap.min.js',
    //       'assets/js/vendor/jquery.unveilEffects.js',
    //       //'assets/js/vendor/retina-1.1.0.js'
    //     ],
    //     dest: 'assets/js/vendor.min.js'
    //   }
    // },
    // cssmin: {
    //   dev: {
    //     src: ['*.css'],
    //     dest: '',
    //     ext: '.css'
    //   }
    // },
    // uglify: {
    //   release: {
    //     src: 'assets/js/theme.min.js',
    //     dest: 'assets/js/theme.min.js'
    //   }
    // },
    //   // https://www.npmjs.org/package/grunt-wp-i18n
    // makepot: {
    //   target: {
    //     options: {
    //       domainPath: '/languages/',    // Where to save the POT file.
    //       potFilename: 'urbanthings.pot',   // Name of the POT file.
    //       type: 'wp-theme'  // Type of project (wp-plugin or wp-theme).
    //     }
    //   }
    // }

  });

    grunt.registerTask( 'default', [
      // 'concat:css',
      // 'concat:vendor_js',
      // 'concat:js',
      // 'sass:dev',
      'watch'
    ]);
  //   grunt.registerTask( 'release', [
  //     'sass:release',
  //     'autoprefixer',
  //     'csscomb',
  //     'concat:css',
  //     'concat:vendor_js',
  //     'concat:js',
  //     'cssmin:release',
  //     'uglify:release',
  //     'makepot'
  // ]);

};