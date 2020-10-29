'use strict';

let express = require('express');
let path = require('path');
let fs = require('fs');
let asyncLib = require('async');
let BaseWidget = require('./base-widget');
let IonLogger = require('core/impl/log/IonLogger');
const {t} = require('core/i18n');
const {format} = require('util');
let sysLog = new IonLogger({});
let moduleName = require('./module-name');

class Manager {

  static logError (err) {
    let message = `Dashboard: ${err}`;
    sysLog.error(message);
    console.error(err);
  }

  render (params, cb) {
    this.checkCurrentLayout(params);
    let layout = this.getLayout(params.currentLayout, params.currentApp);
    if (!layout) {
      return cb(t('Dashboard layout not set up.'));
    }
    let p = {
      dashboard: this,
      app: params.currentApp,
      layout: params.currentLayout,
      ...params
    };
    params.res.app.render(layout, p, (err, data)=> {
      if (err) {
        return cb(err);
      }
      p.layoutContent = data;
      params.res.app.render(path.join(__dirname, 'view/templates/tools.ejs'), p, cb);
    });
  }

  init (scope, expressApp, cb) {
    try {
      this.expressApp = expressApp;
      this.layoutParams = scope.settings.get('dashboard.layouts') || {};
      this.layouts = {};
      setLayouts(path.join(__dirname, 'layouts'), this.layouts);
      this.widgets = {};
      setWidgets(path.join(__dirname, 'widgets'), this.widgets);
      this.apps = {};
      let roots = scope.settings.get('dashboard.root') || {};
      for (let id in roots) {
        if (roots.hasOwnProperty(id)) {
          this.apps[id] = {
            layouts: {},
            widgets: {},
            root: path.join(__dirname, '../../', roots[id])
          };
        }
      }
      setAppLayouts(this.apps, this.layouts);
      setAppWidgets(this.apps, this.widgets);

      asyncLib.forEachOfSeries(this.widgets, (widget, id, cb)=> {
        this.widgets[id].init(cb);
      }, err => {
        err && this.logError(err);
        cb(err);
      });
    } catch (err) {
      this.logError(err);
      cb(err);
    }
  }

  configurate (config, cb) {
    if (!config || config.merged) {
      return cb();
    }
    try {
      for (let id in config) {
        if (config.hasOwnProperty(id)) {
          let root = path.join(__dirname, '../../', config[id].root);
          this.expressApp.use(`/${moduleName}/${id}`, express.static(path.join(root, 'static')));
          this.apps[id] = {
            layouts: setLayouts(path.join(root, 'layouts'), this.layouts, `${id}-`),
            widgets: setWidgets(path.join(root, 'widgets'), this.widgets, `${id}-`),
            root
          };
        }
      }
      config.merged = true;
      asyncLib.forEachOfSeries(this.widgets, (widget, id, cb)=> {
        this.widgets[id].init(cb);
      }, err => {
        err && this.logError(err);
        cb(err);
      });
    } catch (err) {
      this.logError(err);
      cb(err);
    }
  }

  getId (id, app) {
    return app ? `${app}-${id}` : id;
  }

  getLayoutTitle (id) {
    return this.layoutParams && this.layoutParams[id] && this.layoutParams[id].title || id;
  }

  getLayout (id, app) {
    id = this.getId(id, app);
    if (!this.layouts[id]) {
      this.logError(format(t('Layout %s not found'), id));
      return null;
    }
    return this.layouts[id];
  }

  getWidget (id, app) {
    id = this.getId(id, app);
    if (!this.widgets[id]) {
      this.logError(format(t('Widget %s not found'), id));
      return null;
    }
    return this.widgets[id];
  }

  logError (err) {
    this.constructor.logError(err);
  }

  checkCurrentLayout(params) {
    params.currentLayout = params.req.cookies ? params.req.cookies['dashboard-layout'] : '';
    let app = params.currentApp;
    let layout = params.currentLayout;
    if (!app || (layout && this.apps[app].layouts.indexOf(layout) === -1)) {
      params.currentLayout = layout = null;
    }
    if (app && !layout) {
      params.currentLayout = layout = this.apps[app].layouts[0];
    }
  }
}
module.exports = new Manager;

function setAppLayouts (apps, layouts) {
  for (let id in apps) {
    if (apps.hasOwnProperty(id)) {
      apps[id].layouts = setLayouts(path.join(apps[id].root, 'layouts'), layouts, `${id}-`);
    }
  }
}

function setLayouts (dir, layouts, prefix) {
  let ids = [];
  prefix = prefix || '';
  try {
    let files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; ++i) {
      let id = path.basename(files[i], '.ejs');
      ids.push(id);
      layouts[prefix + id] = path.join(dir, files[i]);
    }
  } catch (err) {}
  return ids;
}

function setAppWidgets (apps, widgets) {
  for (let id in apps) {
    if (apps.hasOwnProperty(id)) {
      apps[id].widgets = setWidgets(path.join(apps[id].root, 'widgets'), widgets, `${id}-`);
    }
  }
}

function setWidgets (dir, widgets, prefix) {
  let ids = [];
  prefix = prefix || '';
  try {
    let files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; ++i) {
      let file = path.join(dir, files[i]);
      try {
        let widget = getWidget(file);
        if (widget) {
          let id = path.basename(files[i], '.js');
          ids.push(id);
          id = prefix + id;
          widget = new widget(id);
          if (widget instanceof BaseWidget) {
            widgets[id] = widget;
          } else {
            Manager.logError(format(t('Widget does not inherit from: %s'), file));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {}
  return ids;
}

function getWidget (file) {
  let widget = require(file);
  if (typeof widget !== 'function') {
    Manager.logError(format(t('Widget class is not defined: %s', file)));
    return null;
  }
  return widget;
}
