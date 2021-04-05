'use strict';

let dashboard = require('../Manager');

module.exports = function (req, res, next) {
  try {
    res.app.render(dashboard.getLayout('gridster-responsive'), {dashboard}, (err, data)=> {
      if (err) {
        dashboard.logError(err);
      }
      res.render('main', {
        basUrl: req.app.locals.baseUrl,
        data
      });
    });
  } catch (err) {
    dashboard.logError(err);
    res.render('main', {
      basUrl: req.app.locals.baseUrl,
      data: err
    });
  }
};
