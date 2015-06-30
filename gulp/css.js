var gulp = require("gulp"),
    postcss = require("gulp-postcss"),
    browserSync = require('browser-sync').create();

gulp.task('css-watch', ["css-build"], browserSync.reload);

gulp.task('css-build', cssPostCSS);

function cssPostCSS() {
  var plugins = [
    require("postcss-mixins"),
    require("postcss-simple-vars"),
    require("postcss-nested")
  ];

  return gulp.src("./src/client/content/css/*.css")
    .pipe(postcss(plugins))
    .pipe(gulp.dest("./src/client/dist/css/"));
}
