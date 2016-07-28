var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    sass        = require('gulp-sass'),
    // coffee      = require('gulp-coffee'),
    babel       = require('gulp-babel'),
    sourcemaps  = require('gulp-sourcemaps'),
    autoprefixer= require('gulp-autoprefixer'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cleanCSS    = require('gulp-clean-css'),
    uglify      = require('gulp-uglify'),
    minimist    = require('minimist'),
    gls         = require('gulp-live-server');

options = minimist(process.argv.slice(2), {
  default: {
    env: process.env.NODE_ENV || 'development',
    port: 3000,
    host: "0.0.0.0"
  },
  string: ["env"],
  alias: {
    port: ['p'],
    host: ['h']
  }
});

gulp.task('build-css', function() {
  return gulp.src(['lib/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write({
      includeContent: false,
      sourceRoot: 'build/sass'
    }))
    .pipe(gulp.dest('server/public/cslib'))
});

gulp.task('build-js', function() {
  return gulp.src(['lib/**/*.js', '!lib/thirdparty/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .on('error', function(e) {
      console.error(e);
      this.emit('end');
    })
    // .pipe(uglify())
    .pipe(sourcemaps.write({
      includeContent: false,
      sourceRoot: 'build/js'
    }))
    .pipe(gulp.dest('server/public/cslib'))
});

gulp.task('copy-static', function() {
  gulp.src(['lib/index.html'])
    .pipe(gulp.dest('server/public'));
  gulp.src(['lib/module/**/*.html', 'lib/module/**/*.jpg', 'lib/module/**/*.png', 'lib/module/**/*.gif' ])
    .pipe(gulp.dest('server/public/cslib/module'));
  gulp.src(['lib/thirdparty/**/*'])
    .pipe(gulp.dest('server/public/cslib/thirdparty'));
});

gulp.task('watch', function() {
  gulp.watch('lib/**/*.scss', ['build-css']);
  gulp.watch('lib/**/*.js', ['build-js']);
  gulp.watch('lib/**/*.html', ['copy-static']);
});

gulp.task('up', function() {
  var opts = {
    cwd: undefined,
    env: process.env
  }
  opts.env.NODE_ENV = options.env;
  opts.env.PORT = options.port;
  opts.env.HOST = options.host;
  
  var server = gls('./index.js', opts);
  server.start();
  gulp.watch(['server/public/**/*.css', 'server/public/**/*.html', 'server/public/**/*.js'], function(file) {
    server.notify.apply(server, [file]);
  });
  gulp.watch('./index.js', server.start.bind(server));
});

gulp.task('default', ['build-css', 'build-js', 'copy-static', 'watch', 'up']);

