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
    .pipe(gulp.dest('client/cslib'))
});

gulp.task('build-js', function() {
  return gulp.src(['lib/**/*.js', '!lib/thirdparty/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: [['env']]
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
    .pipe(gulp.dest('client/cslib'))
});

gulp.task('copy-static', function() {
  gulp.src(['lib/index.html'])
    .pipe(gulp.dest('client'));
  gulp.src([
    'lib/module/**/*.html',
    'lib/module/**/*.jpg',
    'lib/module/**/*.png',
    'lib/module/**/*.gif',
    'lib/module/**/*.json',
    'lib/module/**/*.mp4'
  ]).pipe(gulp.dest('client/cslib/module'));

  gulp.src(['lib/thirdparty/**/*'])
    .pipe(gulp.dest('client/cslib/thirdparty'));
});

gulp.task('watch', ['build-css', 'build-js', 'copy-static'], function() {
  gulp.watch('lib/**/*.scss', ['build-css']);
  gulp.watch(['lib/**/*.js', '!lib/thirdparty/**/*.js'], ['build-js']);
  gulp.watch(['lib/**/*.html', 'lib/thirdparty/**/*'], ['copy-static']);
});

gulp.task('up', function() {  
  var server = gls('./server/server.js', {
    env: {
      NODE_ENV: options.env,
      host: options.host,
      port: options.port
    }
  });
  server.start();
  gulp.watch(['client/**/*.css', 'client/**/*.html', 'client/**/*.js'], function(file) {
    server.notify.apply(server, [file]);
  });
  gulp.watch('./server/server.js', server.start.bind(server));
});

gulp.task('build', ['build-css', 'build-js', 'copy-static']);

gulp.task('default', ['build', 'watch', 'up']);

