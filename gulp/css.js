var gulp = require("gulp"),
    postcss = require("gulp-postcss"),
    concat = require("gulp-concat"),
    browserSync = require('browser-sync').create();

gulp.task('css-watch', ["css-build"], browserSync.reload);

gulp.task('css-build', cssPostCSS);

function cssPostCSS() {
  var plugins = [
    require("postcss-mixins"),
    require("postcss-simple-vars"),
    require("postcss-nested")
  ];

  var client = "./src/client/content/css/";

  var files = [
    client + '**/*.module.css',
    client + '**/*.css'
  ];

  return gulp.src(files)
    .pipe(postcss(plugins))
    .pipe(concat("style.css"))
    .pipe(gulp.dest("./src/client/dist/css/"));
}
