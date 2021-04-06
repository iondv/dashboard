'use strict';

// jscs:disable requireCapitalizedComments

const path = require('path');
const express = require('express');
const router = express.Router();
const { di } = require('@iondv/core');
const config = require('./config');
const dispatcher = require('./controllers');
const { load } = require('@iondv/i18n');
const isProduction = process.env.NODE_ENV === 'production';
const isDevelop = process.env.NODE_ENV === 'development';
const {
  util: {
    staticRouter, extViews, theme
  }
} = require('@iondv/web');

router.get('/', dispatcher.main);
router.all('/widget/:id', dispatcher.refresh);

let app = express();
app.engine('ejs', require('ejs-locals'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view/default/templates'));
app.use('/', router);

app._init = function (moduleName) {
  return load(path.join(process.cwd(), 'i18n'))
    .then(() => di(moduleName, config.di, { module: app }, 'app'))
    .then(scope => {
      let staticOptions = isDevelop ? {} : scope.settings.get('staticOptions');
      const themePath = scope.settings.get(moduleName + '.theme') || config.theme || 'default'
      theme(
        app,
        null,
        __dirname,
        themePath,
        scope.sysLog,
        staticOptions
      );
      extViews(app, scope.settings.get(`${moduleName}.templates`));
      app.use('/', router);
      const statics = staticRouter(scope.settings.get(`${moduleName}.statics`));
      if (statics)
        app.use('/', statics);
      let roots = scope.settings.get('dashboard.root');
      if (roots) {
        for (let id in roots) {
          let dir = path.join('@iondv', roots[id], 'static');
          app.use(`/${id}`, express.static(dir, staticOptions));
        }
      }
      let manager = require('./Manager');
      return new Promise((r, j) => {
        manager.init(scope, app, err => err ? j(err) : r());
      });
    });
};

module.exports = app;
