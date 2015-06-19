var gulp = require("gulp"),
    browserSync = require('browser-sync').create();


gulp.task('js-watch', browserSync.reload);
gulp.task('css-watch', browserSync.reload);

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./app"
        }
    });

    gulp.watch("./app/js/*.js", ['js-watch']);
    gulp.watch("./app/css/*.css", ['css-watch']);
});