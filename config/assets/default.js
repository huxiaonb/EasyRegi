'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
          'public/lib/bootstrap/dist/css/bootstrap-theme.css',
          'public/lib/angular-ui-grid/ui-grid.min.css',
          'public/lib/AngularJS-Toaster/toaster.css',
          'public/lib/font-awesome/css/font-awesome.min.css',
          'public/lib/AdminLTE/dist/css/AdminLTE.min.css',
          'public/lib/AdminLTE/dist/css/skins/skin-blue.min.css',
          'public/lib/bootstrap/dist/css/bootstrap.css',
          'public/lib/angular-ui-select/dist/select.min.css',
          'public/css/company/company.css',
          'public/lib/bootstrap/dist/css/bootstrap-theme.css',
          'public/lib/jquery-confirm2/dist/jquery-confirm.min.css'
        // endbower
      ],
      js: [
        // bower:js
        //'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
          'public/lib/jquery/dist/jquery.min.js',
          'public/lib/angular/angular.js',
          'public/lib/angular-resource/angular-resource.js',
          'public/lib/angular-animate/angular-animate.js',
          'public/lib/angular-messages/angular-messages.js',
          'public/lib/angular-sanitize/angular-sanitize.js',
          'public/lib/angular-ui-router/release/angular-ui-router.js',
          'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
          'public/lib/angular-ui-grid/ui-grid.js',
          'public/lib/angular-cookies/angular-cookies.min.js',
          'public/lib/pdfmake/build/pdfmake.js',
          'public/lib/pdfmake/build/vfs_fonts.js',
          'public/customize_lib/ueditor/ueditor.config.js',
          'public/customize_lib/ueditor/ueditor.all.js',
          'public/customize_lib/angular-ueditor/dist/angular-ueditor.js',
          'public/lib/AngularJS-Toaster/toaster.js',
          'public/lib/AdminLTE/bootstrap/js/bootstrap.min.js',
          'public/lib/AdminLTE/dist/js/app.min.js',
          'public/lib/angular-ui-select/dist/select.min.js',
          'public/lib/jquery-confirm2/dist/jquery-confirm.min.js',
          'public/lib/echarts/dist/echarts.min.js'
        // endbower
      ]
    },
    css: [
      'client/*/css/*.css'
    ],
    js: [
      'client/core/app/config.js',
      'client/core/app/init.js',
      'client/*/*.js',
      'client/**/*.js'
    ],
    img: [
      'client/**/*/img/**/*.jpg',
      'client/**/*/img/**/*.png',
      'client/**/*/img/**/*.gif',
      'client/**/*/img/**/*.svg'
    ],
    views: ['client/*/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'server/**/*.js'],
    models: 'server/*/models/**/*.js',
    routes: ['server/!(core)/routes/**/*.js','server/core/routes/**/*.js'],
    config: 'server/*/config/*.js',
    policies: 'server/*/policies/*.js',
    views: 'server/*/views/*.html'
  }
};
