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

//import {Grid} from './../layout/widgets/grid';
import {JqGrid} from './../layout/widgets/jq-grid';
import {Chart} from './../layout/widgets/chart';
import {SearchBox} from './../layout/widgets/search-box';
import {DetailedView} from './../layout/widgets/detailed-view';
import {DataSourceConfigurator} from './../layout/widgets/data-source-configurator';

import {DashboardConfiguration} from './dashboard-configuration';

@inject(EventAggregator, WidgetFactory, UserStateStorage, DashboardManager, PeriscopeRouter, Factory.of(StaticJsonDataService), Factory.of(JsonDataService), Factory.of(CacheManager))
export class JqDashboardConfiguration extends DashboardConfiguration  {
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
    var ordersGrid = this._widgetFactory.createWidget(JqGrid, {
      name:"gridWidgetOrders",
      header:"Orders",
      stateStorage: this._stateStorage,
      navigatable: false,
      minHeight: 450,
      pageSize: 40,
      behavior:[
        new DataActivatedBehavior("order-details",this._eventAggregator),
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
          format: "date"
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



    var dbOrders = this._dashboardManager.createDashboard("customers",{
      title:"Orders",
      route: "/customers"
    });
    dbOrders.addWidget(ordersGrid, {size_x:12, size_y:'*', col:1, row:1});
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
      message => { return ("record.Id=='" + message.activatedData["Id"].toString() + "'") }
    );
    var manageNavigationStackBehavior = new ManageNavigationStackBehavior(this._eventAggregator);
    replaceWidgetBehavior.attach(dbOrders);
    manageNavigationStackBehavior.attach(dbOrders);
  }
}
