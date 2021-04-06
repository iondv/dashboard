'use strict';

(function () {

  Dashboard.Shapshot = function ($widget, params) {
    this.$widget = $widget;
    this.$info = $widget.find('.info-holder');
    this.params = $.extend(true, {
      maxXSteps: 50,
      snapChart: {
        type: 'doughnut',
        options: {
          cutoutPercentage: 60,
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true,
            position: 'bottom'
          }
        }
      },
      lineChart: {
        labelFormat: 'HH:mm:ss',
        type: 'line',
        data: {
          labels: [],
          datasets: [{data:[]}],
        },
        options: {
          //animation: false,
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            onComplete: this.onAnimationComplete.bind(this)
          },
          scales:{
            xAxes: [{
              display: false
            }]
          },
          legend: {
            display: false
          }
        }
      }
    }, params);
    this.data = { labels: [], values: [] };
    this.info = {};
    this.init();
  };

  $.extend(Dashboard.Shapshot.prototype, {

    init: function () {
      this.refresh(0, this.create);
    },

    refresh: function (delay, handler) {
      setTimeout(function () {
        $.get(this.params.url).done(function (result) {
          handler.call(this, result);
          this.refresh(this.params.refreshDelay, this.update);
        }.bind(this));
      }.bind(this), delay);
    },

    create: function (result) {
      var params = this.params;
      this.params.snapChart.data.datasets[0].data = [result.busy, result.free];
      this.snapChart = new Chart(this.$widget.find('.snap-chart-canvas'), params.snapChart);

      var label = moment().format(this.params.lineChart.labelFormat);
      var value = result.busy;
      this.params.lineChart.data.datasets[0].data = [value, value];
      this.params.lineChart.data.labels = ['', label];
      this.setMaxYAxe(result);
      this.lineChart = new Chart(this.$widget.find('.line-chart-canvas'), params.lineChart);

      this.$widget.removeClass('loading');
      this.appendData(label, value);
      this.updateInfo();
    },

    setMaxYAxe: function (result) {
      var max = parseInt(result.busy) + parseInt(result.free);
      this.params.lineChart.options.scales.yAxes[0].ticks.max = max;
    },

    update: function (result) {
      var params = this.params;
      this.params.snapChart.data.datasets[0].data = [result.busy, result.free];
      this.snapChart.update();

      var data = this.params.lineChart.data;
      var labels = data.labels;
      var values = data.datasets[0].data;
      var label = moment().format(this.params.lineChart.labelFormat);
      var value = result.busy;

      labels.push(label);
      values.push(value);
      if (labels.length > this.params.maxXSteps) {
        labels.splice(0, 1);
        values.splice(0, 1);
      }
      this.lineChart.update();
      this.appendData(label, value);
      this.updateInfo();
    },

    appendData: function (label, value) {
      this.data.labels.push(label);
      this.data.values.push(value);
    },

    updateInfo: function () {
      this.setInfoValue('refresh', parseInt(this.params.refreshDelay / 1000) +' sec.');
      this.setLastMaxInfo();
      this.setLastMinInfo();
    },

    setLastMaxInfo: function () {
      var last = this.data.values.length - 1;
      var index = this.info.lastMaxIndex;
      if (index === undefined || this.data.values[last] >= this.data.values[index]) {
        this.info.lastMaxIndex = index = last;
      }
      this.setInfoValue('last-max', this.formatInfoData(index));
    },

    setLastMinInfo: function () {
      var last = this.data.values.length - 1;
      var index = this.info.lastMinIndex;
      if (index === undefined || this.data.values[last] <= this.data.values[index]) {
        this.info.lastMinIndex = index = last;
      }
      this.setInfoValue('last-min', this.formatInfoData(index));
    },

    formatInfoData: function (index) {
      return this.data.values[index] +'% <small>('+ this.data.labels[index] +')</small>';
    },

    setInfoValue: function (name, value) {
      this.$info.find('.'+ name +'-info-item').find('.info-item-value').html(value);
    },

    getLastMaxIndex: function () {
      for (var i = 0; i < this.data.values.length; ++i) {
      }
    },

    onAnimationComplete: function () {
    }

  });

  // CpuShapshot

  Dashboard.CpuShapshot = function ($widget, params) {
    Dashboard.Shapshot.apply(this, arguments);
  };

  $.extend(Dashboard.CpuShapshot.prototype, Dashboard.Shapshot.prototype, {
    constructor: Dashboard.CpuShapshot,

    updateInfo: function () {
      Dashboard.Shapshot.prototype.updateInfo.call(this);
    },
  });

  // RamShapshot

  Dashboard.RamShapshot = function ($widget, params) {
    Dashboard.Shapshot.apply(this, arguments);
  };

  $.extend(Dashboard.RamShapshot.prototype, Dashboard.Shapshot.prototype, {
    constructor: Dashboard.RamShapshot,

    updateInfo: function () {
      Dashboard.Shapshot.prototype.updateInfo.call(this);
    },

    formatInfoData: function (index) {
      return this.data.values[index] +' Mb <small>('+ this.data.labels[index] +')</small>';
    },
  });

  // HddShapshot

  Dashboard.HddShapshot = function ($widget, params) {
    Dashboard.Shapshot.apply(this, arguments);
  };

  $.extend(Dashboard.HddShapshot.prototype, Dashboard.Shapshot.prototype, {
    constructor: Dashboard.HddShapshot,

    updateInfo: function () {
      Dashboard.Shapshot.prototype.updateInfo.call(this);
    },

    formatInfoData: function (index) {
      return this.data.values[index] +' Gb <small>('+ this.data.labels[index] +')</small>';
    }
  });

})();

