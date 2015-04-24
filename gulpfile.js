// Gulp and gulp plugins
var gulp = require('gulp');
var smith = require('gulpsmith');
var $ = require('gulp-load-plugins')();
var path = require('path');
var encode = require('metalsmith-encode-html');
var templates = require('metalsmith-templates');
var browserSync = require('browser-sync');
var assign = require('lodash.assign');
var babel = require('gulp-babel');
var sourcemaps = require("gulp-sourcemaps");

var config = {
    browsers        : ['Explorer 11', 'Safari 7', 'Chrome >= 35,', 'Firefox >= 30', 'Android >= 4'],
    sass_path       : './src/scss',
    sass_includes   : [
        'bower_components/breakpoint-sass/stylesheets',
        'bower_components/bootstrap-sass-official/assets/stylesheets',
        'bower_components/css/admin',
        'bower_components/css'
    ],
    nunjucks_path   : './html' ,
    build_path      : './dist',
    scripts_path    : './src/js/*.js'
};


// Browser Sync
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: config.build_path
        }
    });
});

// Sass task
gulp.task('sass', function(){
    gulp.src(config.sass_path+'/**/*.scss')
        .pipe($.rubySass({
            loadPath: config.sass_includes,
            style: 'compressed',
            quiet: true,
            compass: true
        }))
        .pipe($.autoprefixer(config.browsers))
        .pipe(gulp.dest(config.build_path+'/css'))
        .pipe($.filter('**/*.css'))
        .pipe(browserSync.reload({stream:true}));
});

// Javascript
gulp.task('scripts', function() {
    gulp.src(config.scripts_path+'/**/*.js')
        .pipe($.uglify())
        .pipe(gulp.dest(config.build_path ))
        .pipe(browserSync.reload({stream:true, once: true}));
});

// Nunjucks
gulp.task('nunjucks', function() {
    gulp.src(config.nunjucks_path+'/**/*.html')
        .pipe($.frontMatter()).on("data", function(file) {
            assign(file, file.frontMatter);
            delete file.frontMatter;
        })
        .pipe(smith()
            .use(templates({
                engine: 'nunjucks',
                inPlace: true
            }))
            .use(encode())
        )
        .pipe(gulp.dest(config.build_path))
        .pipe(browserSync.reload({stream:true}));
});

// Babel
gulp.task('babel', function() {
    gulp.src(config.scripts_path)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(config.build_path+'/js'));
});

gulp.task('copy', function() {
   gulp.src(['../Content/css/*.css', '../Content/Brackets/css/**/*.css' ])
       .pipe(gulp.dest('build/css'));
});


// Watch task
gulp.task('default', ['sass', 'nunjucks', 'scripts', 'copy', 'browser-sync'], function(){
    gulp.watch('**/*.scss', ['sass']);
    gulp.watch('js/**/*.js', ['scripts']);
    gulp.watch(['html/**/*.html', 'templates/**/*.html'], ['nunjucks']);
});

// Build
gulp.task('build', ['sass', 'babel']);

