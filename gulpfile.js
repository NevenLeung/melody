var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    cleancss = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    notify = require('gulp-notify'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    gulpif = require('gulp-if');
    ngannotate = require('gulp-ng-annotate'),
    del = require('del'),
    browserSync = require('browser-sync');

// js hinting
gulp.task('jshint', function () {
    return gulp.src('src/script/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// clean the file
gulp.task('clean', function () {
    return del(['dist']);
});

// copy the ico font file to the dist/fonts
gulp.task('copyFonts', function() {
    return gulp.src(['./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*', './bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*'])
        .pipe(gulp.dest('dist/fonts'));
});


// pack, minify, and substitute the depended file in html tag
gulp.task('pack', ['jshint'], function () {
    return gulp.src('./src/**/*.html')
        .pipe(useref())             //pack the file in index.html the build comment
        .pipe(gulpif('*.js', ngannotate()))   // for angularJS
        .pipe(gulpif('*.js', uglify()))       // minify js
        .pipe(gulpif('*.js', rev()))          // append hash to the packed js file
        .pipe(gulpif('*.css', cleancss()))    // minify css
        .pipe(gulpif('*.css', rev()))         // append hash to the packed js file
        // substitute the useref filename with the hash filename in index.html
        .pipe(revReplace())
        .pipe(gulp.dest('dist'));
});

// image
gulp.task('imagemin', function() {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'));
        // .pipe(notify({ message: 'Images task complete' }));
});

// Watch
gulp.task('watch', ['browser-sync'], function() {

    // Watch .js, .css, .html files
    gulp.watch('{src/scripts/**/*.js,src/styles/**/*.css, src/**/*.html}', ['pack']);

    // Watch image files
    gulp.watch('app/images/**/*', ['imagemin']);

});

gulp.task('browser-sync', ['default'], function () {
    var files = [
        'src/**/*.html',
        'src/styles/**/*.css',
        'src/images/**/*',
        'src/scripts/**/*.js',
        'dist/**/*'
    ];

    browserSync.init(files, {
        server: {
            baseDir: "dist",
            index: "index.html"
        }
    });

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', browserSync.reload);

});

// make sure the clean task is over before other tasks start
gulp.task('default', ['clean'], function () {
    gulp.start('pack', 'imagemin','copyFonts');
});


