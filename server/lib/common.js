var jwt = require('jsonwebtoken');
var path = require('path');
var env = process.env.NODE_ENV || 'development';
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

// seconds * minutes * hours:
var exp_seconds = 60 * 60 * 4; // == 4 hrs.    * 8; // == 8 hrs.

exports = module.exports = {
  expires: exp_seconds,

  daysBetween: function (date1, date2) {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.round(difference_ms / one_day);
  },

  munge: function () {
    return '7aea9feae88d665004509af64e836be9b4048f43c5fab4cf9963f3bc1dfad4d2f9bb9ae1b6820e4041e2aa4cdce936cf49429c3d3062f416fe695562e495253f';
    // return config.database + config.username + config.password;
  },

  extract: function (token, error_callback) {
    try {
      return jwt.verify(token, exports.munge(), {
        ignoreExpiration: false
      }); // ignoreExpiration: true when using mocked old token in services.js
    } catch (err) {
      error_callback({
        error: err
      });
    }
  },

  resign: function (req, callback, error_callback) {
    var token = req.headers.authorization.split(' ')[1];
    var payload = exports.extract(token, error_callback);
    if (!payload) {
      return error_callback(null);
    }
    payload.exp = Math.floor(Date.now() / 1000) + exp_seconds;
    var token = jwt.sign(payload, exports.munge());
    // console.log("Re-signed jwt to: " + payload.exp);
    callback(token);
  },

  validAdminToken: function (req, error_callback) {
    if (!req.headers.admin || req.headers.admin.split(' ')[0] !== 'Bearer') {
      return false;
    }

    var token = req.headers.admin.split(' ')[1];
    var payload = exports.extract(token, error_callback);

    return payload;
  },

  validateToken: function (req) {
    if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') {
      return false;
    }

    var token = req.headers.authorization.split(' ')[1];
    var payload = exports.extract(token, function (error) {
      // had troble extracting.  Just return false here.
      return false;
    });

    return payload;
  },

  admins: ['mikeg@pdq.net'],

  is_admin: function (user) {
    // throw ("Should NOT get here.");  // Unless an admin is removing a duplicate approval.
    return exports.admins.indexOf(user.toLowerCase()) >= 0;
  }

};
