// auth.js
// Allow a FB login so I can just use a username for access to features or albums.
var common = require(__dirname + '/../lib/common');
var express = require('express');
var router = express.Router();
var path = require('path');
var jwt = require('jsonwebtoken');
var env = process.env.NODE_ENV || 'development';
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

exports = module.exports = {
  init: function (callback) {
    exports.addRoutes();
    callback(null, router);
  },

  addRoutes: function () {
    router.post('/', function (req, res) {
      exports.auth(req, res);
    });
  },

  auth: function (req, res) {
    if (req.headers.authorization) {
      req.headers.authorization = null; // Don't use any existing header.
    }
    let creds = false;

    // TODO: Use FB login.  set username to FB email address.
    if (req.body.username && req.body.password === 'Jonny5') {
      creds = {
        "username": req.body.username
      }
    }
    if (config.mockAuth) {
      creds = config.mockAuth;
    }

    if (creds) {
      let toSign = {
        exp: Math.floor(Date.now() / 1000) + common.expires,
        username: creds.username,
        isAdmin: common.is_admin(creds.username)
      }

      let token = jwt.sign(toSign, common.munge());
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send({
        "token": token
      }).end();
    } else {
      console.log('Authentication failed!');
      if (res._headerSent === false) {
        res.setHeader('Content-Type', 'text/plain');
        res.status(401).send("Not Authorized").end(); // Bad Request.
      }
    }
  }
}