'use strict';

// jscs:disable requireCapitalizedComments

const path = require('path');
const express = require('express');
const router = express.Router();
const di = require('core/di');
const config = require('./config');
const moduleName = require('./module-name');
const dispatcher = require('./controllers');
const {load} = require('core/i18n');
const isProduction = process.env.NODE_ENV === 'production';

router.get('/', dispatcher.main);
router.all('/widget/:id', dispatcher.refresh);

let app = express();
app.use(`/${moduleName}`, express.static(path.join(__dirname, 'view/static')));
app.engine('ejs', require('ejs-locals'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view/templates'));
app.use(`/${moduleName}`, router);

app._init = function () {
  return load(path.join(__dirname, 'i18n'))
    .then(() => di(moduleName, config.di, { module: app }, 'app'))
    .then(scope => {
      let staticOptions = isProduction ? scope.settings.get(`staticOptions`) : undefined;
      let roots = scope.settings.get('dashboard.root');
      if (roots) {
        for (let id in roots) {
          let dir = path.join(__dirname, '../../', roots[id], 'static');
          app.use(`/${moduleName}/${id}`, express.static(dir, staticOptions));
        }
      }
      let manager = require('./index');
      return new Promise((r, j) => {
        manager.init(scope, app, err => err ? j(err) : r());
      });
    });
};

module.exports = app;
