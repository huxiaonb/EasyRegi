'use strict';

import gulp from 'gulp'
import plugins from 'gulp-load-plugins'
import run from 'run-sequence'
import webpack from 'webpack'
import nodemon from 'gulp-nodemon'
import config  from './config/config'
import webpackConfig from './webpack.config.babel'



gulp.task('webpack-watch', () => {
    console.log(webpackConfig);
    webpack(webpackConfig).watch({
        aggregateTimeout: 300
    }, (err, stats) => {
        console.log(err);
        console.log(stats.toString({
            colors: true,
            chunks: false
        }))
    });
})
gulp.task('webpack-build', () => {
    webpack(webpackConfig).run((err, stats) => {
        console.log(stats.toString({
            colors: true,
            chunks: false
        }))
    })
})


gulp.task('clean', function () {
  return gulp.src('dist',{read:false})
        .pipe(plugins.clean());
});

gulp.task('start', function () {
  nodemon({
    script: 'server.js',
    ext: 'js,html',
    watch: ['server/**/*', 'config/**/*']
  })
})








gulp.task('dev', ['webpack-watch', 'start'])

gulp.task('build', ['webpack-build', 'start'])