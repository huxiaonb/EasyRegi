'use strict';

module.exports = {
  app: {
    title: 'MEAN.JS',
    description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
    keywords: 'mongodb, express, angularjs, node.js, mongoose, passport',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  port: process.env.PORT || 80,
  host: process.env.HOST || '0.0.0.0',
  staticPath : './public',
  viewPath: './',
  templateEngine: 'swig',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'MEAN',
  // sessionKey is set to the generic sessionId key used by PHP applications
  // for obsecurity reasons
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  // Lusca config
  csrf: {
    csrf: false,
    csp: { /* Content Security Policy object */},
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  //logo: 'modules/core/client/img/brand/logo.png',
  //favicon: 'modules/core/client/img/brand/favicon.ico',
  favicon:'favicon.ico',
  uploads: {
    profileUpload: {
      dest: './modules/users/client/img/profile/uploads/', // Profile upload destination path
      limits: {
        fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
      }
    },
    applicantsUpload: {
      dest: './public/upload',
      limits: {
        fileSize: 5 * 1024 * 1024 // Max file size in bytes (5 MB)
      }
    }
  },
  wechat: {
    appId: 'wx54e94ab2ab199342',
    appSecret: 'd5e42e98caebab277fb8cc0c6ee5a797'
  },
  emailConfig: {
    adminEmailBanner: '入职易<easyregitest@126.com>',
    smtp: 'smtp.126.com',
    port: 465,
    secure: true,
    auth: {
      user: 'easyregitest@126.com',
      pass: 'easyregi123'
    },
    emailFrom: '入职易<easyregitest@126.com>',
    verificationSubject: '请验证您在入职易的注册邮箱',
    verificationHtmlTemplate: '<p>您好！</p><p>入职易收到了邮箱 [Registered_Email] 的注册申请，请点击一下链接完成注册:</p><br><a href="[Verification_Link]">[Verification_Link]</a><br><p>如果邮箱中不能打开链接，您也可以将它复制到浏览器地址栏中打开。</p>',
    resetPwdSubject: '您更改帐号信息的验证码是:[Reset_Password_Captcha]',
    resetPwdHtmlTemplate: '<p>您好!</p><p>此次帐号信息变更需要的验证码如下，请在 30 分钟内输入验证码进行下一步操作。</p><br><p>[Reset_Password_Captcha]</p><br><p>如果非你本人操作，你的帐号可能存在安全风险，请立即修改密码。</p>'
  }
};
