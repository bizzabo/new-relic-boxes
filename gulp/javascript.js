var gulp = require("gulp"),
    concat = require("gulp-concat"),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    debug = require("gulp-debug"),
    vendor = require("main-bower-files"),
    browserSync = require('browser-sync').create(),
    sourcemaps = require("gulp-sourcemaps");

gulp.task('js-watch', ['js-concat'], browserSync.reload);

gulp.task('js-concat', ['js-vendor'],concatJS);
gulp.task('js-vendor', vendorJS);

function vendorJS(){
    return gulp.src(vendor({filter:"**/*.js"}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat("vendor.js"))
        .pipe(uglify())
        .pipe(rename({suffix:".min"}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./src/client/dist/js/"));
}

function concatJS() {
  var clientApp = "./src/client/app/";
  var files = [
    clientApp + '**/*.module.js',
    clientApp + '**/*.js'
  ];

  var ngAnnotateOptions = {
    remove: true,
    add: true,
    single_quotes: true
  };

  return gulp.src(files)
    .pipe(sourcemaps.init({loadmaps:true}))
    .pipe(concat("app.js"))
    .pipe(ngAnnotate(ngAnnotateOptions))
    .pipe(uglify())
    .pipe(rename({suffix:".min"}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./src/client/dist/js/"));
}
