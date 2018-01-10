'use strict';

import gulp from 'gulp';
import gulpsync from 'gulp-sync';
import plugins from 'gulp-load-plugins'
import run from 'run-sequence'
import webpack from 'webpack'
import clean from 'gulp-clean'
import nodemon from 'gulp-nodemon'
import config  from './config/config'
import webpackConfig from './webpack.config.babel'
import webpackMobileConfig from './mobile/webpack.config.babel'




gulp.task('webpack-watch', () => {
    webpack([webpackConfig,webpackMobileConfig]).watch({
        aggregateTimeout: 300
    }, (err, stats) => {
        console.log(stats.toString({
            colors: true,
            chunks: false
        }))
    });
})
gulp.task('webpack-build', () => {
    webpack([webpackConfig,webpackMobileConfig]).run((err, stats) => {
        console.log(stats.toString({
            colors: true,
            chunks: false
        }))
    })
})


gulp.task('clean', function () {
  return gulp.src('dist',{read:false})
        .pipe(clean({force: true}));
});

gulp.task('start', function () {
  nodemon({
    script: 'server.js',
    ext: 'js,html',
    watch: ['server/**/*', 'config/**/*']
  })
})








gulp.task('dev', gulpsync(gulp).sync(['clean', 'webpack-watch', 'start']))

gulp.task('build', gulpsync(gulp).sync(['clean', 'webpack-build', 'start']))