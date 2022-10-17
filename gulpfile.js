const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');


// Таск компиляции SASS в CSS
function buildSassDev() {
    return src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
            .pipe(sass({ includePaths: ['./node_modules'] }).on('error', sass.logError))
            .pipe(
                postcss([
                    autoprefixer({
                        grid: true,
                        overrideBrowserslist: ['last 2 versions']
                    }),
                    cssnano()
                ])
            )
        .pipe(sourcemaps.write())
        .pipe(dest('src/css'))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

function buildSass() {
    return src('src/scss/**/*.scss')
        .pipe(sass({ includePaths: ['./node_modules'] }).on('error', sass.logError))
        .pipe(
            postcss([
                autoprefixer({
                    grid: true,
                    overrideBrowserslist: ['last 2 versions']
                }),
                cssnano()
            ])
        )
        .pipe(dest('dist/css'));
}

function buildHtml() {
    return src('src/**/*.html')
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function copy() {
    return src(['src/assets/**/*.*']).pipe(dest('dist'));
}

function cleanDist() {
    return src('dist', { allowEmpty: true }).pipe(clean());
}

function serve() {
    watch('src/scss/**/*.scss', buildSassDev);
    watch('src/**/*.html', buildHtml);
}

exports.sass = buildSass;
exports.html=buildHtml;
exports.copy=copy;

function createDevServer() {
    browserSync.init({
        server: 'src',
        notify: false
    })
}

exports.build = series(cleanDist, parallel(buildSass, buildHtml, copy))
exports.default = series(buildSassDev, parallel(createDevServer, serve));
