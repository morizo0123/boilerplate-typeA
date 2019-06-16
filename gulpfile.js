const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const spritesmith = require('gulp.spritesmith');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const cleancss = require('gulp-clean-css');
const rename = require('gulp-rename');

const paths = {
  'src': {
    'html': './src/*.html',
    'sass': './src/sass/**/*.scss',
    'sassSprite': './src/sass/sprite',
    'sprite': './src/images/sprite/*.png',
    'js': './src/js/*.js'
  },
  'dist': {
    'css': './dist/css',
    'imagesSprite': './dist/images/sprite'
  }
};

const autoprefixerOption = {
  grid: true
};

const postcssOption = [ autoprefixer(autoprefixerOption) ];

gulp.task('browserSync', (done) => {
  browserSync.init({
    server: {
      baseDir: './src',
    }
  });
  done();
});

gulp.task('sass', () => {
  return gulp.src(paths.src.sass)
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(postcss(postcssOption))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(cleancss())
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browser.reload({stream:true}))
});

gulp.task('sprite', (done) => {
  let spriteData = gulp.src(paths.src.sprite)
    .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite.scss',
        imgPath: paths.dist.imagesSprite
    }));
    spriteData.img.pipe(gulp.dest(paths.dist.imagesSprite));
    spriteData.css.pipe(gulp.dest(paths.src.sassSprite));
    done();
});

gulp.task("default", (done) => {
  gulp.watch(paths.src.sass, gulp.series('sass'));
  done();
});