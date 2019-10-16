This page in [Russian](/README_RU.md)

# IONDV. Dashboard

<h1 align="center"> <a href="https://www.iondv.com/"><img src="/dashboard.png" alt="IONDV. Dashboard" align="center"></a>
</h1>  

**Dashboard** - is an IONDV. Framework module. It is used to build a desktop panel, which displays information about the key objects of the system, organized in the form of widgets. It allows you to organize, highlight and display important information in brief for users.

## IONDV. Framework in brief

**IONDV. Framework** - is a node.js open source framework for developing accounting applications
or microservices based on metadata and individual modules. Framework is a part of 
instrumental digital platform to create enterprise 
(ERP) apps. This platform consists of the following open-source components: the [IONDV. Framework](https://github.com/iondv/framework), the
[modules](https://github.com/topics/iondv-module) и ready-made applications expanding it
functionality, visual development environment [Studio](https://github.com/iondv/studio) to create metadata for the app.

* For more details, see [IONDV. Framework site](https://iondv.com). 

* Documentation is available in the [Github repository](https://github.com/iondv/framework/blob/master/docs/en/index.md).

## Description

The control panel consits of three basic entities - manager, layout and widget.

**Manager** - is the main component of the module, responsible for creating and initializing widgets, layouts, connecting the panel to other modules.

**Layout** - is a template (.ejs - file extension), which defines the following components:
* arrangement of widgets, 
* options for widget templates, 
* plugin to control the layout grid on the client (e.g. gridster), 
* connection of shared resources.

**Widget** - is an object that is located on the layout and interacts with the server via ajax-requests. 

Widgets may be static, or may have a link to go to the list of system objects. _Static widget_ display information in the form specified for the widget image, or in the form of statistical data on the system objects, calculated by the specified formulas or conditions for filters. While _widgets with a link to the list of objects_ - display information about the number of objects that match the conditions in this list. [Read more about widget setting](/docs/ru/layouts.md).

## Module Features

- Ensuring the formation of information blocks with digital and graphic data. 
- Allows you to customize several groups of views and customize for each user.

## Intended use of the module using demo projects as an example

_Dashboard_ module is used in [pm-gov-ru.iondv.com](https://pm-gov-ru.iondv.com/geomap) demo project.

IONDV. Project-management is an application for project activities. A set of widgets for which summary information on the accounting objects created in the registry (projects, events, meetings, indicators, etc.) is displayed, where the current user is a participant. It's available on the control panel.

The following types of widgets are presented on the control panel:

* **Object List Widget**. The widget provides information about the number of accounting objects displayed in the list to navigate the link. Information on objects is displayed in accordance with the filter conditions specified for both widgets and navigation.

* **Widget Summary Data**. The widget provides summary data for any of the accounting objects of the system. Its difference from the list of objects widget is that the information displayed in it depends only on the filter conditions specified directly for the widget itself, and not on the number of objects in the list for any navigation.


--------------------------------------------------------------------------  


 #### [Licence](/LICENCE) &ensp;  [Contact us](https://iondv.com) &ensp;    [Russian](/README_RU.md)   &ensp; [FAQs](/faqs.md)

--------------------------------------------------------------------------  

Copyright (c) 2018 **LLC "ION DV"**.  
All rights reserved. 