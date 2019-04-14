'use strict';

let Base = require('../../base-widget');
let os = require('os');
let diskspace = require('diskspace');

module.exports = class HddSnapshot extends Base {
  job (cb) {
    try {
      let root = os.platform() === 'win32' ? os.homedir().charAt(0) : '/';
      diskspace.check(root, (err, total, free, status)=> {
        if (err) {
          return cb(err);
        }
        cb(null, {
          free: (free / 1024 / 1024 / 1024).toFixed(2),
          busy: ((total - free) / 1024 / 1024 / 1024).toFixed(2)
        });
      });
    } catch (err) {
      this.logError(err);
      cb(err);
    }
  }
};
module.exports.init(module);
