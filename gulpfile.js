var gulp = require('gulp')
var runSequence = require('run-sequence')
var del = require('del')
var path = require('path')
var SystemBuilder = require('systemjs-builder')

var reloader = null

var SERVER_ROOT = (__dirname + '/dist/')
var SERVER_PORT = 3000
var RELOAD_PORT = 3010

var runDefault = (cb) => runSequence(
  'clean', ['js', 'html', 'images', 'js-deps', 'css-deps', 'sass'], 'angular-bundle', cb
)

gulp.task('default', runDefault)

// runs a live-reload server
gulp.task('dev', () => runDefault(() => { // first () => is required to find gulp tasks from runDefault
  var server = require('./server-middleware.js')
  server.listen(SERVER_PORT)
  console.log(`listening on port ${SERVER_PORT}`)
  reloader = require('tiny-lr')()
  reloader.listen(RELOAD_PORT)
  console.log(`live-reload on port ${RELOAD_PORT}`)
  watchSource()
  gulp.watch('./dist/**/*.js', notifyLiveReload)
  gulp.watch('./dist/**/*.html', notifyLiveReload)
  gulp.watch('./dist/**/*.css', notifyLiveReload)
}))

// remove old build contents
gulp.task('clean', () => del.sync(['dist']))

// move js files
gulp.task('js', () => {
  return gulp.src('./src/**/*.js')
    .pipe(gulp.dest('./dist/'))
})

// move html files
gulp.task('html', () => {
  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./dist/'))
})

// move images files
gulp.task('images', () => {
  return gulp.src('./src/public/images/*')
    .pipe(gulp.dest('./dist/public/images/'))
})

// transpile & move scss
gulp.task('sass', () => {
  var sass = require('gulp-sass')
  return gulp.src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/'))
})

// move js deps out of node_modules
gulp.task('js-deps', () => {
  return gulp.src([
    'system.config.js',
    './node_modules/traceur/bin/traceur.js',
    './node_modules/traceur/bin/traceur-runtime.js',
    './node_modules/systemjs/dist/system.js',
    './node_modules/reflect-metadata/Reflect.js',
    './node_modules/zone.js/dist/zone.js',
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js'
  ]).pipe(gulp.dest('./dist/public/lib'))
})

// move js deps out of node_modules
gulp.task('css-deps', () => {
  return gulp.src([
    './node_modules/bootstrap/dist/css/bootstrap.min.css'
  ]).pipe(gulp.dest('./dist/public/styles'))
})

// build angular+rx bundle
gulp.task('angular-bundle', (cb) => {
  var builder = new SystemBuilder()
  return builder.loadConfig('./system.config.js')
    .then(() => builder.buildStatic(
      'app',
      'dist/public/lib/libs-bundle.js',
      { minify: true }
    ))
    .catch(err => console.log(err))
})

// Utility functions

var watchSource = () => {
  gulp.watch('./src/**/*.js', ['js'])
  gulp.watch('./src/**/*.html', ['html'])
  gulp.watch('./src/**/*.scss', ['sass'])
}

var notifyLiveReload = (event) => {
  var fileName = path.relative(SERVER_ROOT, event.path)
  reloader.changed({ body: { files: [fileName] } })
}
