var gulp = require("gulp"),
    browserSync = require('browser-sync').create();


gulp.task('js-watch', browserSync.reload);
gulp.task('css-watch', browserSync.reload);

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./src/client"
        }
    });

    gulp.watch(["./src/client/js/*.js", "./src/client/app/*.js"], ['js-watch']);
    gulp.watch("./src/client/css/*.css", ['css-watch']);
});