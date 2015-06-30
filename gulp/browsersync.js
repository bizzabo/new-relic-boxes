var gulp = require("gulp"),
    browserSync = require('browser-sync').create();

// Static server
gulp.task('browser-sync', ["css-build", "js-concat"], function(){
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

    gulp.watch(["./src/client/app/**/*.js", "./src/client/app/*.js"], ['js-watch']);
    gulp.watch("./src/client/content/css/*.css", ['css-watch']);
    gulp.watch("./src/client/*.html", browserSync.reload);
}
