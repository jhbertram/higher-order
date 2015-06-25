require('babel/polyfill');
var spawn = require('child_process').spawn;
var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var babel = require('gulp-babel');
var jshint = require('gulp-jshint');

gulp.task('default', ['build', 'test', 'lint']);
gulp.task('build', ['6to5']);

gulp.task('test', function (cb) {
	require('babel/register');
	return gulp.src('src/test/**/*.spec.js', {read: false})
	.pipe(mocha({reporter: 'spec' }))
	.on('error', function(err) {
		gutil.log.apply(this, Array.prototype.slice.call(arguments));
	});
});

gulp.task('lint', function () {
	gulp.src(['src/**/*.js'])
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('6to5', function () {
	return gulp.src('src/**/*.js')
		.pipe(babel())
		.pipe(gulp.dest('dist'));
});
gulp.task('spawn-build', function (_cb) {
	var cb = function () {
		console.log('spawn-build CALLBACK: ', arguments);
		_cb.apply(this, arguments);
	};
	var p = spawn('gulp', ['default'], {stdio: 'inherit', env: process.env});
	p.on('exit', cb);
	p.on('error', function () {
		gutil.log.apply(this, Array.prototype.slice.call(arguments));
		cb.apply(this, arguments);
	});
});

gulp.task('watch', function () {
	return [
		gulp.watch(['src/**/*.js', '!node_modules/**/*'], ['spawn-build']),
	];
});
