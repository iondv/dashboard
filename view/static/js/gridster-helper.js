'use strict';

(function () {

  window.GridsterHelper = function ($gs, params, $widgetToggle) {
    this.$gs = $gs;
    this.$ul = $gs.find('> ul');
    this.widgets = new Widgets(this.$ul.children().children('.widget'));

    this.restore();

    if ($widgetToggle) {
      this.widgetMenu = new WidgetMenu(this.widgets, $widgetToggle, this);
      $widgetToggle.change(this.store.bind(this));
    } else {
      this.widgets.toggleActive(true);
    }
    if (!params.draggable) {
      params.draggable = {};
    }
    if (!params.resize) {
      params.resize = {};
    }
    var store = this.store.bind(this);
    params.draggable.stop = store;
    params.resize.stop = store;

    this.$ul.gridster(params);
    this.$ul.css({
      'padding': '0'
    });
    this.gs = this.$ul.data('gridster');
  };

  $.extend(GridsterHelper.prototype, {

    store: function () {
      store.set(this.getStoredId(), {
        'gs': this.gs.serialize(),
        'widgets': this.widgets.serialize()
      });
    },

    getStoredId: function () {
      return 'dashboard-'+ this.$gs.data('app') +'-'+ this.$gs.data('layout');
    },

    restore: function () {
      var data = store.get(this.getStoredId());
      this.restoreGridster(data && data.gs);
      this.widgets.restore(data && data.widgets);
    },

    restoreGridster: function (data) {
      if (data instanceof Array) {
        var $cells = this.$ul.find('>li');
        if ($cells.length === data.length) {
          $cells.each(function (i) {
            try {
              var $cell = $(this);
              $cell.attr('data-col', data[i].col);
              $cell.attr('data-row', data[i].row);
              $cell.attr('data-sizex', data[i].size_x);
              $cell.attr('data-sizey', data[i].size_y);
            } catch (err) {}
          });
        }
      }
    }
  });

  // WIDGETS

  function Widgets ($widgets) {
    this.map = {};
    this.$widgets = $widgets;
    this.create();
  }

  $.extend(Widgets.prototype, {

    create: function () {
      this.$widgets.each(function (index, element) {
        var widget = new Widget($(element));
        if (this.get(widget.id)) {
          throw new Error('Duplicate widget ID: '+ widget.id);
        }
        this.map[widget.id] = widget;
      }.bind(this));
    },

    get: function (id) {
      return this.map[id] instanceof Widget ? this.map[id] : null;
    },

    getByElement: function ($element) {
      $element = $element.closest('.widget');
      var widgets = this.getAll();
      for (var w in widgets) {
        if (widgets[w].isElement($element)) {
          return widgets[w];
        }
      }
    },

    getAll: function () {
      var result = [];
      for (var r in this.map) {
        result.push(this.map[r]);
      }
      return result;
    },

    toggleActive: function (state) {
      this.getAll().forEach(function (widget) {
        widget.toggleActive(state);
      });
    },

    serialize: function () {
      var result = {};
      this.getAll().forEach(function (widget) {
        result[widget.id] = widget.isActive();
      });
      return result;
    },

    restore: function (data) {
      if (!data) {
        data = {};
      }
      this.getAll().forEach(function (widget) {
        if (!data.hasOwnProperty(widget.id) || data[widget.id]) {
          widget.toggleActive(true);
        }
      });
    }
  });

  // WIDGET

  function Widget ($widget) {
    this.$widget = $widget;
    this.params = $widget.data('params');
    this.id = this.params.id;
  }

  $.extend(Widget.prototype, {

    init: function () {
      var method = this.$widget.data('init');
      if (typeof method === 'function') {
        method();
        this.$widget.data('init', null);
      }
    },

    isActive: function () {
      return this.$widget.hasClass('active');
    },

    isElement: function ($element) {
      return this.$widget.get(0) === $element.get(0);
    },

    toggleActive: function (state) {
      this.$widget.toggleClass('active', state);
      if (this.isActive()) {
        this.init();
      }
    }
  });

  // WIDGET MENU

  function WidgetMenu (widgets, $toggle) {
    this.widgets = widgets;
    this.$toggle = $toggle;
    this.create();
  }

  $.extend(WidgetMenu.prototype, {

    create: function () {
      this.$menu = $('<div class="input-menu"></div>').html(this.createItems());
      this.$toggle.click(this.show.bind(this));
      $(document.body).append(this.$menu).click(this.onClickDocument.bind(this));
      this.$menu.on('change', 'input', this.onChangeItem.bind(this));
      this.widgets.$widgets.on('click', '.widget-close', this.onCloseWidget.bind(this));
    },

    onClickDocument: function (event) {
      if (this.isActive()) {
        var $target = $(event.target);
        if (!$target.closest(this.$toggle).length && !$target.closest(this.$menu).length) {
          this.$menu.hide();
        }
      }
    },

    onChangeItem: function (event) {
      var $input = $(event.target).blur();
      this.widgets.get($input.val()).toggleActive($input.is(':checked'));
      this.$toggle.trigger('change');
    },

    onCloseWidget: function () {
      var widget = this.widgets.getByElement($(event.target));
      this.$menu.find('[value="'+ widget.id +'"]').click();
    },

    createItems: function () {
      return this.widgets.getAll().map(this.createItem, this).join('');
    },

    createItem: function (widget) {
      var checked = widget.isActive() ? 'checked' : '';
      var title = widget.params.title;
      return '<label class="item-label" title="'+ title
        + '"><input type="checkbox" '+ checked +' value="'
        + widget.id +'">'+ title +'</label>';
    },

    isActive: function () {
      return this.$menu.is(':visible');
    },

    show: function () {
      var offset = this.$toggle.offset();
      this.$menu.show();
      this.$menu.offset({
        'left': offset.left + this.$toggle.outerWidth() - this.$menu.outerWidth(),
        'top': offset.top + this.$toggle.outerHeight() + 1
      });
    }
  });
})();
