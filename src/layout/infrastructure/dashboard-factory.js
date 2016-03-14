import {inject, bindable} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Grid} from 'layout/widgets/grid';
import {Chart} from 'layout/widgets/chart';
import {SearchBox} from 'layout/widgets/search-box';
import {DetailedView} from 'layout/widgets/detailed-view';
import {Repository} from 'data/repository';
import {ManageNavigationStackBehavior} from 'navigator/dashboardbehavior/manage-navigation-stack-behavior';
import {DataFieldSelectedBehavior} from 'navigator/widgetbehavior/data-field-selected-behavior';
import {DataSelectedBehavior} from 'navigator/widgetbehavior/data-selected-behavior';
import {DataActivatedBehavior} from 'navigator/widgetbehavior/data-activated-behavior';
import {DataFilterChangedBehavior} from 'navigator/widgetbehavior/data-filter-changed-behavior';
import {DataFilterHandleBehavior} from 'navigator/widgetbehavior/data-filter-handle-behavior';
import {SettingsHandleBehavior} from 'navigator/widgetbehavior/settings-handle-behavior';
import {CreateWidgetBehavior} from 'navigator/dashboardbehavior/create-widget-behavior';
import {ReplaceWidgetBehavior} from 'navigator/dashboardbehavior/replace-widget-behavior';
import {ChangeRouteBehavior} from 'navigator/dashboardbehavior/change-route-behavior';
import {WidgetFactory} from 'layout/infrastructure/widget-factory';
import {GridsterDashboard} from 'layout/gridster-dashboard';
import {BootstrapDashboard} from 'layout/bootstrap-dashboard';
import {PeriscopeRouter} from 'navigator/periscope-router';
import {NavigationHistory} from 'navigator/navigation-history';
import {UserStateStorage} from 'state/user-state-storage';
import {StateUrlParser} from 'state/state-url-parser';
import {StringHelper} from 'helpers/string-helper';
/*import {Factory} from './factory';
import {CacheManager} from './' Factory.of(MyClass)*/

@inject(Repository, EventAggregator, WidgetFactory, PeriscopeRouter, UserStateStorage, NavigationHistory)
export class DashboardFactory {

  constructor(repository, eventAggregator, widgetFactory, periscopeRouter, userStateStorage, navigationHistory) {
    this._repository = repository;
    this._eventAggregator = eventAggregator;
    this._widgetFactory = widgetFactory;
    this._router = periscopeRouter;
    this._stateStorage = userStateStorage;
    this._navigationHistory = navigationHistory;

  }

  getDashboard(name, params){
    var dashboard;
    switch (name.toLowerCase()) {
      case 'customers':
        dashboard = this._getDefaultDashboard(params);
        break;
      case 'orders':
        dashboard = this._getOrdersDashboard(params);
        break;
    }
    if (dashboard) {
      var stackBehavior = new ManageNavigationStackBehavior(this._eventAggregator);
      stackBehavior.attach(dashboard);
    }
    return dashboard;
  }

  _getDefaultDashboard(params){
      var dsCustomers = this._repository.getDatasource("customers");


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


      var dashboard = new BootstrapDashboard("customers");
      dashboard.title = "Customers";


      dashboard.addWidget(searchBox, {size_x:12, size_y:1, col:1, row:1});
      dashboard.addWidget(customersGrid,{size_x:6, size_y:"*", col:1, row:2});
      dashboard.addWidget(chart, {size_x:"*", size_y:"*", col:7, row:2});

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
          router: this._router
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
      changeRoureBefavior.attach(dashboard);
      createWidgetBehavior.attach(dashboard);

      return dashboard;
    }

    _getOrdersDashboard(params){

        var dsOrders = this._repository.getDatasource("orders");


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
        var searchBoxName = "ordersSearchWidget";

        // create search box
        var searchBox = this._widgetFactory.createWidget(SearchBox, {
          name:searchBoxName,
          header:"Orders",
          showHeader:false,
          dataSource: dsOrders,
          dataFilter:"",
          stateStorage: this._stateStorage,
          behavior:[
            new DataFilterChangedBehavior("ordersSearchChannel",this._eventAggregator)
          ]
        });


        var dashboard = new BootstrapDashboard("orders");
        dashboard.title = "Orders";

        dashboard.addWidget(searchBox, {size_x:12, size_y:1, col:1, row:1});
        dashboard.addWidget(ordersGrid, {size_x:12, size_y:'*', col:1, row:2});

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
              showHeader:true,
              /*columns:[
                {
                  field: "Sycode"
                },
                {
                  field: "TradePrice",
                  title: "Price"
                },
                {
                  field: "Portfolio"
                }
                ,
                {
                  field: "Quantity"
                },
                {
                  field: "TreasuryCPDescription",
                  title: "Treasury Description"
                },
                {
                  field: "TransactionDescription",
                  title: "Transaction"
                },
                {
                  field: "Broker",
                  title: "Broker"
                },
                {
                  field: "CustodianAccountCode",
                  title: "Account Code"
                }
              ]*/
            },
            message => { return ("record.Id=='" + message.activatedData.get("Id").toString() + "'"); }
        );
        replaceWidgetBehavior.attach(dashboard);

        return dashboard;
    }
}
