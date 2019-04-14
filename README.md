Эта страница на [Русском](/docs/ru/readme.md)

# IONDV. Dashboard

Dashboard is a IONDV. Framework module. 

### Start with IONDV. Framework

* [IONDV. Framework](https://github.com/iondv/framework/blob/master/README.md)
* [IONDV. Framework Docs](https://github.com/iondv/framework/blob/master/docs/en/index.md)

## Description 

**IONDV. Dashboard** -  is a module designed to display brief information in the form of blocks, based on the widget model.


### Dashboard Module Docs

**TODO** - docs from platform.

# Модуль Панель управления (dashboard)

Панель управления состоит из трех базовых сущностей - менеджер, макет и виджет.

### Менеджер (manager)

Менеджер - это основной компонент модуля, отвечающий за создание и инициализаци виджетов, макетов, подключение панели к другим модулям.
```sh
let manager = require('modules/dashboard/manager');
```

### Макет (layout)

Макет - это EJS шаблон, в котором определяются схема размешения виджетов, параметры ддя шаблонов виджетов, плагин для управления сеткой макета на клиенте (например gridster), подключаются общие ресурсы. 

Базовые макеты модуля находятся в папке /dashboard/layouts. Опубликованные из мета-данных в папке /applications/${meta-namespace}/layouts.  

Каждый макет имеет уникальный ID. При публикации макета из меты к ID добавляется префикс. 
```sh
let dashboard = require('modules/dashboard');
dashboard.getLayout('demo');
dashboard.getLayout('develop-and-test-demo');
```
При рендере макета необходимо передать объект manager.
```sh
res.render(dashboard.getLayout('demo'), { dashboard });
```

### Виджет (widget)

Виджет - это объект, который размещается на макете и взаимодействует с сервером через ajax-запросы. 

Базовые виджеты модуля находятся в папке /dashboard/widgets. Опубликованные из мета-данных в папке /applications/${meta-namespace}/widgets.  

Виджет состоит из файла класса **index.js** и шаблона представления **view.ejs**.
Класс должен наследоваться от базового класса /dashboard/base-widget или его потомков.

- Метод **init()** отвечает за начальную инициализацию виджета при старте сервера.
- Метод **refresh()** вызывается при получении ajax-запроса от клиента. 
- Метод **job()** получает данные для виджета.

Каждый виджет имеет уникальный ID. При публикации виджета из меты к ID добавляется префикс.
```sh
dashboard.getWidget('demo');
dashboard.getWidget('develop-and-test-demo');
```
При рендере представления виджета необходимо передать объект widget.
```sh
<% var widget = dashboard.getWidget('develop-and-test-demo') %>
<%- partial(widget.view, {widget}) %>
```
### Публикация из меты

Пример структуры в applications/develop-and-test
```sh
    dashboard
        layouts
          demo-layout
        widgets
          demo-widget
            index.js
            view.ejs
        static
            layouts              
            widgets
              demo-widget 
```

* [Full Description]()
* [Deploy]()



--------------------------------------------------------------------------  


 #### [Licence](/LICENCE) &ensp;  [Contact us](https://iondv.com) &ensp;  [Russian](/docs/ru/readme.md)   &ensp; [FAQs](/faqs.md)          

<div><img src="https://mc.iondv.com/watch/local/docs/dashboard" style="position:absolute; left:-9999px;" height=1 width=1 alt="iondv metrics"></div>

--------------------------------------------------------------------------  

Copyright (c) 2018 **LLC "ION DV"**.  
All rights reserved. 