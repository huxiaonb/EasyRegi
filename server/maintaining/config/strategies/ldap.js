/**
 * Created by SHENJO on 5/26/2016.
 */
'use strict';

var passport = require('passport'),
  LdapStrategy = require('passport-ldapauth');


module.exports = function () {
  // Use local strategy

  passport.use(new LdapStrategy({
    server: {
      url: 'ldap://146.222.5.160:389',
      bindDn: 'oocldm\\gdscsvc',//your domainID
      bindCredentials: 'Password12',//Password
      searchBase: 'DC=corp,DC=oocl,DC=com',
      searchFilter: '(&(objectClass=user)(samaccountname={{username}}))',
      usernameField: 'username',
      passwordField: 'password'
    },
    passReqToCallback: true
  },function(req, user, done) {
    return done(null, user);
  }));
};
