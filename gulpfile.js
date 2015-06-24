var gulp = require("gulp"),
    requireDir = require("require-dir");

requireDir("./gulp");

gulp.task("serve", ["browser-sync"]);
gulp.task("docs", ["browser-sync-docs"]);
gulp.task("default", ["serve"]);