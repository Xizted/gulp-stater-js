const { series, src, dest, watch } = require('gulp');
const sass = require('gulp-sass')(require('dart-sass'));
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const webp = require('gulp-webp');
const concat = require('gulp-concat');

// utilidades css
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemap = require('gulp-sourcemaps');

// utilidades JS
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');

const paths = {
  img: './src/img/**/*',
  scss: './src/scss/**/*.scss',
  js: './src/js/**/*.js',
};

const css = () =>
  src(paths.scss)
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemap.write('.'))
    .pipe(dest('./build/css'));

const js = () =>
  src(paths.js)
    .pipe(concat('bundle.js'))
    .pipe(sourcemap.init())
    .pipe(terser())
    .pipe(sourcemap.write('.'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('./build/js'));

const minificarCss = () =>
  src(paths.scss)
    .pipe(
      sass({
        outputStyle: 'compressed',
      })
    )
    .pipe(dest('./build/css'));

const imagenes = () =>
  src(paths.img)
    .pipe(imagemin())
    .pipe(dest('./build/img'))
    .pipe(notify({ message: 'Imagen Minificada' }));

const versionWebp = () =>
  src(paths.img)
    .pipe(webp())
    .pipe(dest('./build/img'))
    .pipe(notify({ message: 'Imagenes convertidas a webp' }));

const watchArchivos = () => {
  watch(paths.scss, css);
  watch(paths.js, js);
};

exports.css = css;
exports.minificarCss = minificarCss;
exports.imagenes = imagenes;
exports.watchArchivos = watchArchivos;
exports.default = series(css, js, imagenes, versionWebp, watchArchivos);
