/**
 * Created by HUGO on 6/30/2016.
 */
'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    generatePassword = require('generate-password'),
    owasp = require('owasp-password-strength-test');

var LoginuserSchema = new Schema({
    userid: {
        type: String,
        lowercase: true,
        required:true
    },
    password:{
        type: String
    },
    salt: {
        type: String
    },
    role: {
        type: String,
        required:true
    },
    accountType: {
        type: String,
        required:true
    },
    created: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        default: 'admin'
    },
    updated: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: String,
        default: 'admin'
    },
});

/**
 * Hook a pre save method to hash the password
 */
LoginuserSchema.pre('save', function (next) {
    console.log('pre saing.....');
    if (this.password && this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

/**
 * Create instance method for hashing a password
 */
LoginuserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
    } else {
        return password;
    }
};

LoginuserSchema.statics.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
    } else {
        return password;
    }
};
/**
 * Create instance method for authenticating user
 */
LoginuserSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};
/**
 * Find possible not used username
 */
LoginuserSchema.statics.findUniqueUsername = function (userid, suffix, callback) {
    var _this = this;
    var possibleUsername = username.toLowerCase() + (suffix || '');

    _this.findOne({
        userid: possibleUsername
    }, function (err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(userid, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

/**
 * Generates a random passphrase that passes the owasp test.
 * Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
 * NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
 */
LoginuserSchema.statics.generateRandomPassphrase = function () {
    return new Promise(function (resolve, reject) {
        var password = '';
        var repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

        // iterate until the we have a valid passphrase.
        // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present.
        while (password.length < 20 || repeatingCharacters.test(password)) {
            // build the random password
            password = generatePassword.generate({
                length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
                numbers: true,
                symbols: false,
                uppercase: true,
                excludeSimilarCharacters: true,
            });

            // check if we need to remove any repeating characters.
            password = password.replace(repeatingCharacters, '');
        }

        // Send the rejection back if the passphrase fails to pass the strength test
        if (owasp.test(password).errors.length) {
            reject(new Error('An unexpected problem occured while generating the random passphrase'));
        } else {
            // resolve with the validated passphrase
            resolve(password);
        }
    });
};
mongoose.model('Loginuser', LoginuserSchema);
