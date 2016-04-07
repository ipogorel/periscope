import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

/*behavior*/
import {ManageNavigationStackBehavior} from './../navigator/dashboardbehavior/manage-navigation-stack-behavior';
import {DataFieldSelectedBehavior} from './../navigator/widgetbehavior/data-field-selected-behavior';
import {DataSelectedBehavior} from './../navigator/widgetbehavior/data-selected-behavior';
import {DataActivatedBehavior} from './../navigator/widgetbehavior/data-activated-behavior';
import {DataFilterChangedBehavior} from './../navigator/widgetbehavior/data-filter-changed-behavior';
import {DataFilterHandleBehavior} from './../navigator/widgetbehavior/data-filter-handle-behavior';
import {SettingsHandleBehavior} from './../navigator/widgetbehavior/settings-handle-behavior';
import {CreateWidgetBehavior} from './../navigator/dashboardbehavior/create-widget-behavior';
import {ReplaceWidgetBehavior} from './../navigator/dashboardbehavior/replace-widget-behavior';
import {ChangeRouteBehavior} from './../navigator/dashboardbehavior/change-route-behavior';
import {DataSourceChangedBehavior} from './../navigator/widgetbehavior/data-source-changed-behavior';
import {DataSourceHandleBehavior} from './../navigator/widgetbehavior/data-source-handle-behavior';

import {CacheManager} from './../cache/cache-manager'
import {MemoryCacheStorage} from './../cache/memory-cache-storage'
import {Factory} from './../infrastructure/factory';
import {StaticJsonDataService} from './../data/service/static-json-data-service';
import {JsonDataService} from './../data/service/json-data-service';
import {Datasource} from './../data/data-source';
import {StaticSchemaProvider} from './../data/schema/providers/static-schema-provider';

import {WidgetFactory} from './../infrastructure/widget-factory';
import {UserStateStorage} from './../state/user-state-storage';
import {StateUrlParser} from './../state/state-url-parser';
import {DashboardManager} from './../infrastructure/dashboard-manager';
import {PeriscopeRouter} from './../navigator/periscope-router';

import {Grid} from './../layout/widgets/grid';
import {Chart} from './../layout/widgets/chart';
import {SearchBox} from './../layout/widgets/search-box';
import {DetailedView} from './../layout/widgets/detailed-view';
import {DataSourceConfigurator} from './../layout/widgets/data-source-configurator';

import {DashboardConfiguration} from './dashboard-configuration';

@inject(EventAggregator, WidgetFactory, UserStateStorage, DashboardManager, PeriscopeRouter, Factory.of(StaticJsonDataService), Factory.of(JsonDataService), Factory.of(CacheManager))
export class DefaultDashboardConfiguration extends DashboardConfiguration  {
  constructor(eventAggregator, widgetFactory, userStateStorage, dashboardManager, periscopeRouter, dataServiceFactory, swaggerServiceFactory, cacheManagerFactory){
    super();
    this._eventAggregator = eventAggregator;
    this._periscopeRouter = periscopeRouter;
    this._dashboardManager = dashboardManager;
    this._stateStorage = userStateStorage;
    this._widgetFactory = widgetFactory;
    this._dataServiceFactory = dataServiceFactory;
    this._swaggerServiceFactory = swaggerServiceFactory;
    this._cacheManager = cacheManagerFactory(new MemoryCacheStorage());
  }

  invoke(){
    var customersDataService = this._dataServiceFactory()
    customersDataService.configure({
        url:'/data/customers.json',
        schemaProvider: new StaticSchemaProvider({
          fields:[
            {
              field:"Id",
              type:"string"
            },
            {
              field:"CompanyName",
              type:"string"
            },
            {
              field:"ContactName",
              type:"string"
            },
            {
              field:"ContactTitle",
              type:"string"
            },
            {
              field:"Address",
              type:"string"
            },
            {
              field:"City",
              type:"string"
            },
            {
              field:"Country",
              type:"string"
            },
            {
              field:"PostalCode",
              type:"string"
            },
            {
              field:"Phone",
              type:"string"
            },
            {
              field:"Fax",
              type:"string"
            }
          ]
        }),
        dataMapper: data=>{
          return data.Results
        }
      }
    )
    var dsCustomers = new Datasource({
      name: "customers",
      cache: {
        cacheTimeSeconds: 120,
        cacheManager: this._cacheManager
      },
      transport:{
        readService: customersDataService
      }
    });



    //Search box
    var searchBox = this._widgetFactory.createWidget(SearchBox, {
      name:"positionsSearchWidget",
      header:"Positions",
      showHeader:false,
      dataSource: dsCustomers,
      dataFilter:"",
      stateStorage: this._stateStorage,
      behavior:[
        new DataFilterChangedBehavior("searchBoxChannel",this._eventAggregator)
      ]
    });

    //customers grid
    var customersGrid = this._widgetFactory.createWidget(Grid, {
      name:"gridWidget",
      header:"Customers",
      showHeader:true,
      minHeight: 450,
      pageSize: 40,
      stateStorage: this._stateStorage,
      navigatable: true,
      behavior:[
        new DataFilterHandleBehavior("searchBoxChannel",this._eventAggregator),
        new DataSelectedBehavior("gridSelectionChannel",this._eventAggregator),
        new DataActivatedBehavior("gridCommandChannel",this._eventAggregator),
        new DataFieldSelectedBehavior("gridFieldSelectionChannel",this._eventAggregator)
      ],
      dataSource: dsCustomers,
      dataFilter:"",
      columns:[
        {
          field: "Id",
          title: "#"
        },
        {
          field: "ContactName",
          title: "Contact Name"
        },
        {
          field: "ContactTitle",
          title: "Contact Title",
          selectable: true
        },
        {
          field: "Country",
          selectable: true
        },
        {
          field: "City"
        }
      ],
      group: {
        field: "Country",
        dir: "asc"
      }
    });

    var chart = this._widgetFactory.createWidget(Chart, {
      name:"chartWidget",
      header:"Country",
      dataSource: dsCustomers,
      showHeader:true,
      dataFilter:"",
      behavior:[
        new DataFilterHandleBehavior("searchBoxChannel", this._eventAggregator),
        new SettingsHandleBehavior(
          "gridFieldSelectionChannel",
          this._eventAggregator,
          message => {
            return {
              header: message.fieldName,
              categoriesField: message.fieldName
            };
          }
        )
      ],
      seriesDefaults:{
        type: "bar",
        labels: {
          visible: true,
          background: "transparent"
        }
      },
      categoriesField: "Country",
      minHeight: 450
    });

    var changeRoureBefavior = new ChangeRouteBehavior(
      {
        chanel: "gridCommandChannel",
        newRoute: {
          title:'Orders',
          route: '/orders',
          dashboardName:'orders'
        },
        paramsMapper: filterEvent => {return StateUrlParser.stateToQuery([{
          key: "orders:ordersSearchWidget",
          value: {
            stateType: "searchBoxState",
            stateObject: "CustomerId = '" + filterEvent.activatedData.get("Id").toString() + "'"
          }
        }])
        },
        eventAggregator: this._eventAggregator,
        router: this._periscopeRouter
      }
    );

    var createWidgetBehavior = new CreateWidgetBehavior(
      'gridSelectionChannel',
      DetailedView,
      {
        name:"detailsWidgetCustomers",
        header:"Customer details",
        behavior:[],
        dataSource: dsCustomers,
        showHeader:true
      },
      {size_x:3, size_y:"*", col:6, row:2},
      this._eventAggregator,
      this._widgetFactory,
      message => { return ("record.Id=='" + message.selectedData.get("Id").toString() + "'");}
    );


    var dbCustomers = this._dashboardManager.createDashboard("customers",{
      title:"Customers",
      route: "/customers"
    });
    dbCustomers.addWidget(searchBox, {size_x:12, size_y:1, col:1, row:1});
    dbCustomers.addWidget(customersGrid,{size_x:6, size_y:"*", col:1, row:2});
    dbCustomers.addWidget(chart, {size_x:"*", size_y:"*", col:7, row:2});

    changeRoureBefavior.attach(dbCustomers);
    createWidgetBehavior.attach(dbCustomers);


    // CONFIGURE ORDERS DASHBOARD
    var ordersDataService = this._dataServiceFactory()
    ordersDataService.configure({
        url:'/data/orders.json',
        schemaProvider: new StaticSchemaProvider({
          fields:[
            {
              field:"Id",
              type:"string"
            },
            {
              field:"CustomerId",
              type:"string"
            },
            {
              field:"EmployeeId",
              type:"string"
            },
            {
              field:"OrderDate",
              type:"date"
            },
            {
              field:"RequiredDate",
              type:"date"
            },
            {
              field:"ShippedDate",
              type:"date"
            },
            {
              field:"ShipVia",
              type:"number"
            },
            {
              field:"Freight",
              type:"number"
            },
            {
              field:"ShipName",
              type:"string"
            },
            {
              field:"ShipAddress",
              type:"string"
            },
            {
              field:"ShipCity",
              type:"string"
            },
            {
              field:"ShipPostalCode",
              type:"string"
            },
            {
              field:"ShipCountry",
              type:"string"
            }
          ]
        }),
        dataMapper: data=>{
          return data.Results
        }
      }
    );

    var dsOrders = new Datasource({
      name: "orders",
      cache: {
        cacheTimeSeconds: 120,
        cacheManager: this._cacheManager
      },
      transport:{
        readService: ordersDataService
      }
    });


    // Orders dashboard
    var ordersGrid = this._widgetFactory.createWidget(Grid, {
      name:"gridWidgetOrders",
      header:"Orders",
      stateStorage: this._stateStorage,
      minHeight: 450,
      pageSize: 40,
      behavior:[
        new DataFilterHandleBehavior("ordersSearchChannel",this._eventAggregator),
        new DataActivatedBehavior("order-details",this._eventAggregator)
      ],
      dataSource: dsOrders,
      showHeader:true,
      dataFilter:"",
      columns:[
        {
          field: "Id",
          title: "#"
        },
        {
          field: "CustomerId",
          title: "Customer"
        },
        {
          field: "OrderDate",
          title: "Order Date",
          format: "{0: MMM.dd yyyy}"
        }
        ,
        {
          field: "Freight"
        },
        {
          field: "ShipName",
          title: "Ship Name"
        },
        {
          field: "ShipCountry",
          title: "Ship Country"
        }
      ]
    });

    //Search box

    var searchBox = this._widgetFactory.createWidget(SearchBox, {
      name:"ordersSearchWidget",
      header:"Orders",
      showHeader:false,
      dataSource: dsOrders,
      dataFilter:"",
      stateStorage: this._stateStorage,
      behavior:[
        new DataFilterChangedBehavior("ordersSearchChannel",this._eventAggregator)
      ]
    });


    var dbOrders = this._dashboardManager.createDashboard("orders",{
      title:"Orders",
      route: "/orders"
    });
    dbOrders.addWidget(searchBox, {size_x:12, size_y:1, col:1, row:1});
    dbOrders.addWidget(ordersGrid, {size_x:12, size_y:'*', col:1, row:2});
    var replaceWidgetBehavior = new ReplaceWidgetBehavior(
      'order-details',
      this._eventAggregator,
      this._widgetFactory,
      "gridWidgetOrders",
      DetailedView,
      {
        name:"detailsWidgetOrder",
        header:"Order Details",
        behavior:[],
        dataSource: dsOrders,
        showHeader:true
      },
      message => { return ("record.Id=='" + message.activatedData.get("Id").toString() + "'"); }
    );
    var manageNavigationStackBehavior = new ManageNavigationStackBehavior(this._eventAggregator);
    replaceWidgetBehavior.attach(dbOrders);
    manageNavigationStackBehavior.attach(dbOrders);


    // CONFIGURE SWAGGER-BASED DASHBOARD
    var swaggerDataService = this._swaggerServiceFactory();
    var dsSwagger = new Datasource({
      name: "datasource",
      cache: {
        cacheTimeSeconds: 120,
        cacheManager: this._cacheManager
      },
      transport:{
        readService: swaggerDataService
      }
    });


    //customers grid
    var swGrid = this._widgetFactory.createWidget(Grid, {
      name:"swaggerGridWidget",
      header:"Swagger Data",
      showHeader:true,
      minHeight: 450,
      pageSize: 40,
      stateStorage: this._stateStorage,
      navigatable: true,
      autoGenerateColumns: true,
      behavior:[
        new DataSourceHandleBehavior("dataSourceConfigChannel",this._eventAggregator)
      ],
      dataFilter:""
    });


    var swgConfiguratorWidget =  this._widgetFactory.createWidget(DataSourceConfigurator, {
      name:"dsConfiguratorWidget",
      header:"Swagger Configuration",
      showHeader:true,
      minHeight: 450,
      stateStorage: this._stateStorage,
      definitionsUrl: "http://petstore.swagger.io/v2/swagger.json",
      dataSourceToConfigurate: dsSwagger,
      behavior:[
        new DataSourceChangedBehavior("dataSourceConfigChannel",this._eventAggregator),
      ]
    });



    var dbSwagger = this._dashboardManager.createDashboard("swagger-api",{
      title:"Swagger",
      route: "/swagger-api"
    });
    dbSwagger.addWidget(swgConfiguratorWidget,{size_x:4, size_y:"*", col:1, row:1});
    dbSwagger.addWidget(swGrid,{size_x:8, size_y:"*", col:5, row:1});
  }
}
