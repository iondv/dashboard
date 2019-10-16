# Layout with widget example settings

```ejs
<%
let task = dashboard.getWidget('namespaceApp-task'); # widget settings
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
          id: 'nameWidget', # widget identifier
          title: 'widget name', 
        },
        redirect: 'registry/namespaceApp@navigationName', # path to the list of objects displayed for the widget
        url: 'registry/api/className@namespaceApp', # the class of objects displayed for the widget
        urlData: {
          node: 'namespaceApp@navigationName', # name of the navigation item of objects displayed for the widget
          filter: [{ # conditions under which objects are displayed for the widget
            "property": "propertyName", # attribute 
            "operation": 0, # operation (equal)
            "value": [ # attribute name
              "$$uid"
            ],
            "nestedConditions": []
          },
            {
              "property": "state",
              "operation": 1, # operation (not equal)
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
      Widgets
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