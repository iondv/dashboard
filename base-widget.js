'use strict';

const path = require('path');
const IonLogger = require('core/impl/log/IonLogger');
const sysLog = new IonLogger({});

module.exports = class Base {

  static init (module) {
    this.dir = path.dirname(module.filename);
  }

  constructor (id) {
    this.id = id;
    this.view = path.join(this.constructor.dir, 'view');
    this.di = require('core/di');
    this.scope = this.di.context('dashboard');
    this.repo = this.scope.dataRepo;
  }

  init (cb) {
    cb();
  }

  refresh (req, res) {
    try {
      this.job((err, result)=> {
        if (err) {
          this.logError(err);
          res.status(500).send(err);
        } else {
          res.send(result);
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }

  }

  job (cb) {
    try {
      cb(null, {});
    } catch (err) {
      cb(err);
    }
  }

  getUrl () {
    return `/dashboard/widget/${this.id}`;
  }

  generateId () {
    return `${this.id}-${Math.floor(Math.random() * 9999999)}`;
  }

  logError (err) {
    let message = `Widget: ${this.id}: ${err}`;
    sysLog.error(message);
    console.error(err);
  }
};
