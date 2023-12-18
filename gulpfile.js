/**

 * @description gulp file for build, test operations

 */
var del = require('del');
var gulp = require('gulp');


gulp.task('clean:dist', function (done) {
    del.sync('dist');
    done();
});

gulp.task('copy-server', function () {
    return gulp.src('./out/**', { base: './out' })
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-views', function () {
    return gulp.src('./src/views/**', { base: './src/views' })
        .pipe(gulp.dest('dist/views'));
});

gulp.task('copy-schema', function () {
    return gulp.src('./src/schema/**', { base: './src/schema' })
        .pipe(gulp.dest('dist/schema'));
});

gulp.task('copy-public', function () {
    return gulp.src('./src/public/**', { base: './src/public' })
        .pipe(gulp.dest('dist/public'));
});

gulp.task('copy-private', function () {
    return gulp.src('./src/private/**', { base: './src/private' })
        .pipe(gulp.dest('dist/private'));
});

gulp.task('copy-dependencies', function () {
    return gulp.src('./node_modules')
        .pipe(gulp.symlink('dist'));
});

gulp.task('build', gulp.series('clean:dist', 'copy-server', 'copy-views', 'copy-dependencies', 'copy-schema', 'copy-public', 'copy-private'));
gulp.task('package', gulp.series('clean:dist', 'copy-server', 'copy-views', 'copy-schema', 'copy-public', 'copy-private'));