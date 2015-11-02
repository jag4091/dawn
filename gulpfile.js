/*------------------------------------*\
    #REQUIRED DEPENDENCIES
\*------------------------------------*/


var
    gulp = require('gulp'),
    gutil = require('gulp-util'),

    jshint = require('gulp-jshint'),
    wrapJS = require("gulp-wrap-js"),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    newer = require('gulp-newer'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require("browser-sync").create(),

    minifycss = require('gulp-minify-css'),
    notify = require("gulp-notify"),

    reload = browserSync.reload,


/*------------------------------------*\
    #FILE LOCATIONS
\*------------------------------------*/


    input = {
        'scss': 'src/resources/scss/**/*.scss',
        'jsComponents': 'src/components/**/*.js',
        'jsPlugins': 'src/resources/js/plugins/*.js',
        'jsVendor' : 'src/resources/js/vendor/*.js',
        'images': 'src/resources/images/**',
        'legacyJsComponents': ['src/resources/js/plugins/respond.min.js', 'src/resources/js/plugins/html5shiv.min.js', 'src/resources/js/plugins/selectivizr-min.js',  'src/resources/js/plugins/modernizr.js']
    },

    output = {
        'stylesheets': 'dist/css',
        'javascript': 'dist/js',
        'images': 'dist/img/',
        'jsPlugins': 'dist/js/plugins',
        'jsVendor': 'dist/js/vendor',
    };


/*------------------------------------*\
    #GULP TASK THAT RUNS AT THE OUTSET
\*------------------------------------*/

gulp.task('default', ['jshint', 'build-js', 'build-plugins', 'build-vendor', 'build-bundle', 'serve']);


/*------------------------------------*\
    #LINT THE JAVASCRIPT
\*------------------------------------*/

gulp.task('jshint', function() {
    return gulp.src(input.jsComponents)
        .pipe(jshint())
        // Use gulp-notify as jshint reporter
        .pipe(notify(function (file) {
          if (file.jshint.success) {
            // Don't show something if success
            return false;
          }

          var errors = file.jshint.results.map(function (data) {
            if (data.error) {
              return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
            }
          }).join("\n");
          return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
        }))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});


/*------------------------------------*\
    #BUILD THE JAVASCRIPT
\*------------------------------------*/

gulp.task('build-js', ['build-legacy-js'], function() {
    return gulp.src(input.jsComponents)
        .pipe(concat('app.js'))
        .pipe(wrapJS('(function ($, window, document, undefined) {%= body % }(jQuery, window, document));'))
        .pipe(gulp.dest(output.javascript));
});

gulp.task('build-legacy-js', function() {
    return gulp.src(input.legacyJsComponents)
        .pipe(gulp.dest(output.jsPlugins));
});

gulp.task('build-plugins', function() {
    return gulp.src([input.jsPlugins, '!src/resources/js/plugins/respond.min.js', '!src/resources/js/plugins/html5shiv.min.js', '!src/resources/js/plugins/selectivizr-min.js'])
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest(output.javascript));
});

gulp.task('build-vendor', function() {
    return gulp.src([input.jsVendor])
        .pipe(gulp.dest(output.jsVendor));
});





/*------------------------------------*\
    #CSS COMPILIATION
\*------------------------------------*/


gulp.task('build-bundle', function() {
    gulp.src('src/resources/scss/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', notify.onError(function(error) {
            return error.message;
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.stylesheets))
         .pipe(reload({stream: true}));
});



/*------------------------------------*\
    #MINIFY IMAGES
\*------------------------------------*/

gulp.task('images', function() {
    return gulp.src(input.images)
        .pipe(newer(output.images))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(output.images));
});



/*------------------------------------*\
    #GULP SERVE - WATCHES FIELS AND SETS UP BROWSERSYNC
\*------------------------------------*/

gulp.task('js-watch', ['jshint', 'build-js'], browserSync.reload);
gulp.task('serve', ['build-bundle', 'jshint', 'build-js', 'build-plugins'], function() {

    browserSync.init({
        proxy: "localhost:8888/boilerplate/"
    });

    gulp.watch([input.scss, 'src/components/**/*.scss'], ['build-bundle']);

    gulp.watch([input.jsComponents], ['js-watch']);
    gulp.watch([input.jsPlugins], ['jshint', 'build-plugins']);
    // gulp.watch([output.jsPlugins, output.javascript], browserSync.reload);
    gulp.watch([input.images], ['images']);
    gulp.watch("src/templates/*.php").on('change', browserSync.reload);
    gulp.watch("src/components/**/*.php").on('change', browserSync.reload);
});
