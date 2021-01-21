const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const size = require('gulp-filesize');
const gulpif = require('gulp-if');
const del = require('del');
const log = require('gulplog');

var isDev = false;

gulp.task('clean', async function () {
	return del([ 'dist' ]);
})

gulp.task('css', async function () {
	return gulp.src('./src/css/base.scss')
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(sass())
		.pipe(cleanCSS({ debug: true }, (details) => {
			console.log('-----------------------------');
			console.log('---CSS---');
			console.log(`Filename: ${details.name}`);
			console.log(`originalSize: ${details.stats.originalSize}`);
			console.log(`minifiedSize: ${details.stats.minifiedSize}`);
			console.log(`efficiency: ${Number((details.stats.efficiency * 100).toFixed(2))}%`);
			console.log('-----------------------------');
		}))
		.pipe(rename('app.min.css'))
		.pipe(gulpif(isDev, sourcemaps.write('.')))
		.pipe(gulp.dest('dist'))
		.pipe(size())
})

gulp.task('js', function () {
	return browserify({
			entries: './src/js/base.js',
			debug: true
		})
		.transform("babelify", {
			presets: ["@babel/preset-env"],
			sourceMaps: true,
			global: true,
			ignore: [/\/node_modules\/(?!your module folder\/)/]
		})
		.bundle()
		.pipe(source('app.min.js'))
		.pipe(buffer())
		.pipe(gulpif(isDev, sourcemaps.init({ loadMaps: true })))
		.pipe(uglify())
		.on('error', log.error)
		.pipe(gulpif(isDev, sourcemaps.write('.')))
		.pipe(gulp.dest('./dist/'))
		.pipe(size())
});

gulp.task('watch', async function () {
	gulp.watch(['./src/**/*.js'], gulp.series('js'));
	gulp.watch(['./src/**/*.scss'], gulp.series('css'));
})

gulp.task('watch', gulp.series(async () => { isDev = true }, 'clean', 'css', 'js', 'watch'));
gulp.task('default', gulp.series('clean', 'css', 'js'));