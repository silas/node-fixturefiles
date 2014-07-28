/**
 * Fixture loader
 */

'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var fs = require('fs');

/**
 * Types.
 */

/**
 * Load fixtures.
 */

function load(basePath, data, opts) {
  if (!fs.existsSync(basePath)) return;

  var stat = fs.statSync(basePath);

  if (!stat.isDirectory()) return;

  fs.readdirSync(basePath).forEach(function(fileName) {
    var filePath = path.join(basePath, fileName);
    var stat = fs.statSync(filePath);
    var ext = path.extname(fileName);
    var name = path.basename(fileName, ext);

    if (stat.isDirectory()) {
      data[name] = {};
      return load(filePath, data[name], opts);
    }
    if (!stat.isFile()) return;

    if (data.hasOwnProperty(name)) {
      throw new Error('conflict: ' + filePath);
    }

    var fileData = fs.readFileSync(filePath);

    var fixture = function(type) {
      switch (type || ext.slice(1)) {
        case 'buffer':
          return fileData.slice();
        case 'json':
          return JSON.parse(fileData.toString());
        default:
          return opts.trim ? fileData.toString().trim() : fileData.toString();
      }
    };

    if (opts.type === 'function') {
      data[name] = fixture;
    } else {
      Object.defineProperty(data, name, {
        configurable: true,
        enumerable: true,
        get: fixture,
      });
    }
  });
}

/**
 * Reload fixtures.
 */

exports.reload = function(opts) {
  opts = opts || {};

  if (!opts.path) {
    opts.path = path.join(process.cwd(), 'test', 'fixtures');
  }

  if (!opts.scope) {
    Object.keys(exports).forEach(function(key) {
      if (key === 'reload') return;
      delete exports[key];
    });

    opts.scope = exports;
  }

  if (!opts.hasOwnProperty('trim')) {
    opts.trim = true;
  }

  load(opts.path, opts.scope, opts);
};

/**
 * Initial load.
 */

exports.reload();
