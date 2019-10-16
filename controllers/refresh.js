'use strict';

let dashboard = require('../index');

module.exports = function (req, res) {
  let widget = dashboard.getWidget(req.params.id);
  if (widget) {
    try {
      widget.refresh(req, res);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(404).send('Виджет не найден');
  }
};
