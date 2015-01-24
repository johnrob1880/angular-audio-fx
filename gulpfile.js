var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    karma = require('karma').server;

var fxCoreDependencies = [
    "./src/ngAudioFxCore/audio-fx-core.module.js",
    "./src/ngAudioFxCore/audio-fx-core.run.js",
    "./src/ngAudioFxCore/audio-fx-core.utils.js",
    "./src/ngAudioFxCore/audio-fx-core.class.js",
    "./src/ngAudioFxCore/audio-fx-core.shared-context.js",
    "./src/ngAudioFxCore/audio-fx-core.buffer-loader.js",
    "./src/ngAudioFxCore/audio-fx-core.base-buffer.js",
    "./src/ngAudioFxCore/audio-fx-core.buffer.js"
];

gulp.task('fxCore', function () {
    gulp.src(fxCoreDependencies)
        .pipe(sourcemaps.init())
        .pipe(concat('audio-fx-core.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js/'));

    gulp.src(fxCoreDependencies)
        .pipe(concat('audio-fx-core.js'))
        .pipe(gulp.dest('./debug/js/'));
});

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.config.js'
    }, done);
});

gulp.task('default', ['fxCore']);

