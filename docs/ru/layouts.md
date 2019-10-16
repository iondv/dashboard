# Пример настройки макета с виджетом

```ejs
<%
let task = dashboard.getWidget('namespaceApp-task'); # определение настроек для виджета
let summary = dashboard.getWidget('namespaceApp-summary');
let toggleParams = {};
%>
<link href="registry/app-vendor/highcharts/css/highcharts.css" rel="stylesheet">
<script src="registry/app-static/js/highcharts.js"></script>

<link href="dashboard/vendor/gridster-js/jquery.gridster.min.css" rel="stylesheet">
<link href="dashboard/namespaceApp/layouts/gridster/gridster.css" rel="stylesheet">
<link href="dashboard/namespaceApp/widgets/task/styles.css" rel="stylesheet">

<script src="dashboard/vendor/gridster-js/jquery.gridster.min.js"></script>
<script src="dashboard/vendor/gridster-js/jquery.gridster.with-extras.min.js"></script>
<script src="dashboard/js/gridster-helper.js"></script>
<script src="dashboard/namespaceApp/widgets/scripts.js"></script>

<script>
  window.ajaxQueue = $.when();
</script>

<div id="gridster" class="gridster dashboard-tasks"
     data-app="<%= app %>"
     data-layout="<%= layout %>">
  <ul>
    <li data-sizey="1" data-sizex="1" data-col="1" data-row="1">
      <%- partial(task.view, {
        widget: task,
        params: {
          id: 'nameWidget', # идентификатор виджета
          title: 'Наименование виджета', # наименование виджета
        },
        redirect: 'registry/namespaceApp@navigationName', # путь к списку объектов, отображаемых для виджета
        url: 'registry/api/className@namespaceApp', # класс объектов, отображаемых для виджета
        urlData: {
          node: 'namespaceApp@navigationName', # наименование пункта навигации объектов, отображаемых для виджета
          filter: [{ # условия, при которых объекты отображаются для виджета
            "property": "propertyName", # атрибут класса
            "operation": 0, # операция (равно)
            "value": [ # значение атрибута
              "$$uid"
            ],
            "nestedConditions": []
          },
            {
              "property": "state",
              "operation": 1, # операция (не равно)
              "value": [
                "edit"
              ],
              "nestedConditions": []
            }]
        }
      })%>
    </li>
  </ul>

  <div class="dashboard-widget-tool hidden">
    <button type="button" class="btn btn-default widget-toggle mr10"
            data-params="<%= JSON.stringify(toggleParams) %>">
      Виджеты
      <span class="caret"></span>
    </button>
  </div>
</div>

<script>
  (function () {
    var $tools = $('.dashboard-layout-tool');
    var $layouts = $tools.find('.dashboard-select-layout');
    $layouts.change(function () {
      Cookies.set('dashboard-layout', $layouts.val(), {
        expires: 30,
        path: ''
      });
      location.reload();
    });
    $('.dashboard-tools').append($tools);
  })();
</script>

<script>
  $(function () {
    var $gridster = $('#gridster');
    var $widgetToggle = $gridster.children('.dashboard-widget-tool').children();
    $('.dashboard-tools').prepend($widgetToggle);
    var helper = new GridsterHelper($gridster, {
      widget_base_dimensions: ['auto', 195],
      autogenerate_stylesheet: true,
      min_cols: 1,
      max_cols: 3,
      widget_margins: [20, 20],
      resize: {
        enabled: true
      }
    }, $widgetToggle);
  });
</script>
```