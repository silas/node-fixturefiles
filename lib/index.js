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
  fs.readdirSync(basePath).forEach(function(fileName) {
    var filePath = path.join(basePath, fileName);
    var ext = path.extname(fileName);
    var name = path.basename(fileName, ext);
    var stat = fs.statSync(filePath);

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
      return;
    }

    Object.defineProperty(data, name, {
      configurable: true,
      enumerable: true,
      get: fixture,
    });
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

  if (!fs.existsSync(opts.path)) return;

  var stat = fs.statSync(opts.path);

  if (!stat.isDirectory()) return;

  load(opts.path, opts.scope, opts);
};

/**
 * Initial load.
 */

exports.reload();
