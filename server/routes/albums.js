// albums.js
// Build a nav tree for base directory,
//   for each directory, build collection of images to display.
var express = require('express');
var router = express.Router();
var path = require('path');
var env = process.env.NODE_ENV || 'development';
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var common = require(__dirname + '/../lib/common');
var debug = require('debug')('tbp_react');
var dir = require('node-dir');
var _ = require('underscore');

exports = module.exports = {
  init: function (cache, callback) {
    exports.cache = cache;
    exports.addRoutes();
    callback(null, router);
  },

  addRoutes: function () {
    // Index
    router.get('/', function (req, res) {
      exports.index(req, res).then((content) => {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).send(JSON.stringify(content, null, 2)).end();
        })
        .catch((error) => {
          res.setHeader('Content-Type', 'application/json');
          res.status(500).send({
            "albums": error
          }).end();
        });
    });

    // Show
    router.get('/:id', function (req, res) {
      exports.show(req, res).then((json) => {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).send(json).end();
        })
        .catch((error) => {
          res.setHeader('Content-Type', 'application/json');
          res.status(500).send({
            "albums": error
          }).end();
        });
    });

  },

  hashCode: function (str) {
    for (var ret = 0, i = 0, len = str.length; i < len; i++) {
      ret = (31 * ret + str.charCodeAt(i)) << 0;
    }
    return ret;
  },

  index: function (req, res) {
    let user = common.validateToken(req);
    debug("albums#index, user context: ", JSON.stringify(user));
    if (req.headers.authorization) {
      req.headers.authorization = null; // Don't use any existing header.
    }
    let key = exports.hashCode(config.albumsRoot + path.sep);
    debug("albums#index cache key: ", key);
    let albumsTree = exports.cache.get(key);
    if (albumsTree === undefined) {
      return exports.fetchTree(req, res, user);
    } else {
      let promise = new Promise(function (resolve, reject) {
        resolve(albumsTree);
      });
      return promise;
    }
  },

  show: function (req, res) {
    let user = common.validateToken(req);
    debug("albums#show, user context: ", JSON.stringify(user));
    if (req.headers.authorization) {
      req.headers.authorization = null; // Don't use any existing header.
    }

    let key = exports.hashCode(config.albumsRoot + path.sep + JSON.stringify(req.query));
    debug("albums#show cache key: ", key);
    let files = exports.cache.get(key);
    if (files === undefined) {
      return exports.fetchImages(req, res, user);
    } else {
      let promise = new Promise(function (resolve, reject) {
        resolve(files);
      });
      return promise;
    }
  },

  tree2json: function (dirMap, parent, partsArray) {
    let tree = parent || {
      module: 'Albums',
      album: 'Albums',
      children: []
    };
    if (typeof(dirMap) === "object") {
      // handle 1 string
      _.each(dirMap, function (dir) {
        let parts = dir.split(path.sep);
        let elem = _.find(tree.children, function (obj) {
          return obj.module === parts[0];
        });
        if (!elem) {
          tree.children.push({
            module: parts[0],
            album: dir,
            leaf: true,
            children: []
          });
        }
        if (parts.length > 1) {
          elem = _.find(tree.children, function (obj) {
            return obj.module === parts[0];
          });
          return exports.tree2json(dir, elem, _.rest(parts))
        }
      });
    } else {
      // handle parts of a string
      let elem = _.find(tree.children, function (obj) {
        return obj.module === partsArray[0];
      });
      if (!elem) {
        parent.children.push({
          module: partsArray[0],
          leaf: true,
          album: dirMap,
          children: []
        });
      }
      if (partsArray.length > 1) {
        return exports.tree2json(dirMap, tree.children[0], _.rest(partsArray))
      }
    }
    return tree;
  },

  fetchTree: function (req, res, user) {
    let promise = new Promise(function (resolve, reject) {
      dir.subdirs(config.albumsRoot, function (err, tree) {
        if (err) {
          reject(err);
        } else {
          let dirMap = [];
          _.each(tree, function (d) {
            let parts = d.split(config.albumsRoot + path.sep);
            dirMap.push(parts[1]);
          });
          dirMap = _.sortBy(dirMap);
          let json = exports.tree2json(dirMap);
          exports.cache.set(config.albumsRoot + path.sep, json)
          resolve(json);
        }
      });
    });
    return promise;
  },

  fetchImages: function (req, res) {
    let promise = new Promise(function (resolve, reject) {
      let folder = config.albumsRoot + path.sep + (req.params.id || req.query.album).split('|').join(path.sep);
      dir.files(folder, 'file', function (err, tree) {
        if (err) {
          reject(err);
        } else {
          let dirMap = [];
          let regex = /.(jpg|jpeg|png|gif)$/;
          _.each(tree, function (d) {
            let parts = d.split(path.sep);
            let filename = parts[parts.length - 1];
            if (filename && filename.match(regex)) {
              dirMap.push(filename);
            }
          });
          dirMap = _.sortBy(dirMap);
          exports.cache.set(config.albumsRoot + path.sep, dirMap)
          resolve(dirMap);
        }
      }, {
        recursive: false
      });
    });
    return promise;
  }
}