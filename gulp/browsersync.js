var gulp = require("gulp"),
    browserSync = require('browser-sync').create();

gulp.task('css-watch', browserSync.reload);

// Static server
gulp.task('browser-sync', function(){
    browserSyncDefinition({
        server: {
            baseDir: "./src/client"
        }
    });
});

gulp.task('browser-sync-docs', ['ngdocs'], function() {
    browserSyncDefinition({
        server: {
            baseDir: "./_docs"
        }
    });
});

function browserSyncDefinition(config) {
    browserSync.init(config);

    gulp.watch(["./src/client/js/*.js", "./src/client/app/*.js"], ['js-watch']);
    gulp.watch("./src/client/css/*.css", ['css-watch']);
}
