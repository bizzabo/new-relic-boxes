var gulp = require("gulp"),
    requireDir = require("require-dir");

requireDir("./tasks");

gulp.task("serve", ["browser-sync"]);
gulp.task("default", ["serve"]);