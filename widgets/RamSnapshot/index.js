'use strict';

let Base = require('../../base-widget');
let osUtil = require ('os-utils');

module.exports = class RamSnapshot extends Base {
  job (cb) {
    try {
      cb(null, {
        free: Math.floor(osUtil.freemem()),
        busy: Math.floor(osUtil.totalmem() - osUtil.freemem())
      });
    } catch (err) {
      this.logError(err);
      cb(err);
    }
  }
};
module.exports.init(module);
