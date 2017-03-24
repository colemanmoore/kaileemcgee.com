/* production-music.yyyounggg.com Gulpfile */

var
  gulp          = require('gulp'),
  through       = require('through'),
  del           = require('del'),
  concat        = require('gulp-concat'),
  plumber       = require('gulp-plumber'),
  stylus        = require('gulp-stylus'),
  csso          = require('gulp-csso'),
  autoprefixer  = require('gulp-autoprefixer'),
  concatcss     = require('gulp-concat-css'),
  bower         = require('main-bower-files'),
  uglify        = require('gulp-uglify'),
  gls           = require('gulp-live-server');

var
  IS_PROD     = process.env.NODE_ENV==='production',
  JS_GLOB     = 'app/src/js/**/*.js',
  CSS_GLOB    = ['app/src/style/*.styl', 'app/src/views/**/*.styl'],
  JADE_GLOB   = 'app/src/views/**/*.jade',
  BUILD_DIR   = 'dist/';

/* SRC Tasks */

// Build JS
gulp.task('js', ['clean:js', 'vendorjs'], function() {
  return gulp.src(JS_GLOB)
    .pipe(IS_PROD ? through() : plumber())
    .pipe(concat('scripts.js'))
    .pipe(IS_PROD ? uglify() : through())
    .pipe(gulp.dest(BUILD_DIR))
});

// Bundle JS dependencies
gulp.task('vendorjs', function() {
  return gulp.src(bower())
    .pipe(concat('vendor.js'))
    .pipe(IS_PROD ? uglify() : through())
    .pipe(gulp.dest(BUILD_DIR))
});

// Build CSS
gulp.task('css', ['clean:css'], function() {
  return gulp.src(CSS_GLOB)
    .pipe(IS_PROD ? through() : plumber())
    .pipe(stylus({
      'include css': true,
      'paths': ['./node_modules']
    }))
    .pipe(autoprefixer('last 2 versions', { map: false }))
    .pipe(concatcss('build.css'))
    .pipe(IS_PROD ? csso() : through())
    .pipe(gulp.dest(BUILD_DIR))
});

gulp.task('build', ['js', 'css']);

gulp.task('clean', function(done) {
  del(BUILD_DIR, done);
});

gulp.task('clean:js', function(done) {
  return del(BUILD_DIR + '*.js', done);
});

gulp.task('clean:css', function(done) {
  return del(BUILD_DIR + '*.css', done);
});


/* Server Tasks */

gulp.task('default', ['serve']);
gulp.task('serve', ['serve:dev']);
gulp.task('serve:dev', ['build'], function() {

  var LR_PORT = 12345;
  var server = gls('app/server.js', { env: { LR_PORT: LR_PORT } }, LR_PORT);
  server.start();

  gulp.watch(['app/server.js', 'app/routes.js'], function() {
    server.start.bind(server)();
  });

  gulp.watch(CSS_GLOB, ['css']).on('change', notifyServer);
  gulp.watch(JS_GLOB, ['js']).on('change', notifyServer);
  gulp.watch(JADE_GLOB).on('change', notifyServer);

  function notifyServer(file) {
    return server.notify.bind(server)(file);
  }

});

gulp.task('serve:prod', ['build'], function() {
  var server = gls('app/server.js');
  server.start();
});
