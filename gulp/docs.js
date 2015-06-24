var gulp = require("gulp");

gulp.task("ngdocs", [], function () {
  var gulpDocs = require("gulp-ngdocs");

  var options = {
    title: "new-relic-boxes Docs"
  };

  return gulp.src("./src/client/app/**/*.js")
    .pipe(gulpDocs.process(options))
    .pipe(gulp.dest("./_docs"));
});