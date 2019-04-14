'use strict';

let Base = require('../../base-widget');
let osUtil = require ('os-utils');

module.exports = class CpuSnapshot extends Base {

  job (cb) {
    try {
      osUtil.cpuUsage(value => {        
        cb(null, {
          free: 100 - Math.floor(value * 100),
          busy: Math.floor(value * 100)
        });
      });
    } catch (err) {
      this.logError(err);
      cb(err);
    }
  }
};
module.exports.init(module);