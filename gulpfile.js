var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('fxCore', function () {
    gulp.src([
        "./src/ngAudioFxCore/audio-fx-core.module.js",
        "./src/ngAudioFxCore/audio-fx-core.run.js",
        "./src/ngAudioFxCore/audio-fx-core.utils.js",
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('audio-fx-core.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js/'));

    gulp.src([
        "./src/ngAudioFxCore/audio-fx-core.module.js",
        "./src/ngAudioFxCore/audio-fx-core.run.js",
        "./src/ngAudioFxCore/audio-fx-core.utils.js",
    ])
        .pipe(concat('audio-fx-core.js'))
        .pipe(gulp.dest('./debug/js/'));
});

