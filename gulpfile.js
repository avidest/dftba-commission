var gulp = require('gulp')
var sass = require('gulp-sass')
var path = require('path')

gulp.task('default', ['static'])

gulp.task('styles', x => {
  var opts = {
    includePaths: [
      path.resolve('node_modules/bootstrap-sass/assets/stylesheets'),
      path.resolve('node_modules/loaders.css/src'),
    ]
  }
  return gulp.src('assets/scss/index.scss')
    .pipe(sass(opts).on('error', sass.logError))
    .pipe(gulp.dest('assets/css'))
})

gulp.task('static', ['styles'], x => {
  return gulp.src('assets/**/*', { base: 'assets' })
    .pipe(gulp.dest('public'))
})

gulp.task('dev', x => {
  gulp.watch([
    'assets/scss/**/*',
    'assets/images/**/*',
  ], ['static'])
})