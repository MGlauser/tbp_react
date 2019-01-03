var express = require("express");
var router = express.Router();
// var debug = require('debug')('tbp_react');

exports = module.exports = {
  init: function (callback) {
    exports.addRoutes(callback);
    callback(null, router);
  },

  addRoutes: function (callback) {
    router.get("/", function (req, res) {
        let date = new Date();
        let text = date.toLocaleString();
        res.setHeader('Content-Type', 'text/plain');
        res.send(text + '\n');
    });
  }
}
