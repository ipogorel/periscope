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
      case 'positions':
        dashboard = this._getDefaultDashboard(params);
        break;
      case 'trades':
        dashboard = this._getTradesDashboard(params);
        break;
    }
    if (dashboard) {
      var stackBehavior = new ManageNavigationStackBehavior(this._eventAggregator);
      stackBehavior.attach(dashboard);
    }
    return dashboard;
  }

  _getDefaultDashboard(params){
      var dsPositions = this._repository.getDatasource("positions");
      var dsTrades = this._repository.getDatasource("trades");


      //Search box
      var searchBox = this._widgetFactory.createWidget(SearchBox, {
        name:"positionsSearchWidget",
        header:"Positions",
        showHeader:false,
        dataSource: dsPositions,
        dataFilter:"",
        stateStorage: this._stateStorage,
        behavior:[
          new DataFilterChangedBehavior("searchBoxChannel",this._eventAggregator)
        ]
      });

      //Positions grid
      var positionsGrid = this._widgetFactory.createWidget(Grid, {
        name:"gridWidget",
        header:"Positions",
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
        dataSource: dsPositions,
        dataFilter:"",
        columns:[
          {
            field: "AssetClass",
            title: "Asset Class",
            selectable: true
          },
          {
            field: "Portfolio",
            selectable: true
          },
          {
            field: "BookEndingMarketValue",
            title: "Market Value"
          },
          {
            field: "CCY",
            title: "CCY",
            selectable: true
          },
          {
            field: "SecurityType",
            title: "Security Type",
            selectable: true
          }
        ],
        group: {
          field: "AssetClass",
          dir: "asc"
        }
      });

      var chart = this._widgetFactory.createWidget(Chart, {
        name:"chartWidget",
        header:"Portfolio",
        dataSource: dsPositions,
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
        categoriesField: "Portfolio",
        minHeight: 450

      });


      //var dashboard = new GridsterDashboard("positions");
      var dashboard = new BootstrapDashboard("positions");
      dashboard.title = "Positions";


      dashboard.addWidget(searchBox, {size_x:12, size_y:1, col:1, row:1});
      dashboard.addWidget(positionsGrid,{size_x:6, size_y:"*", col:1, row:2});
      dashboard.addWidget(chart, {size_x:"*", size_y:"*", col:7, row:2});

      var changeRoureBefavior = new ChangeRouteBehavior(
        {
          chanel: "gridCommandChannel",
          newRoute: {
            title:'Trades',
            route: '/trades',
            dashboardName:'trades'
          },
          paramsMapper: filterEvent => {return StateUrlParser.stateToQuery([{
              key: "trades:tradesSearchWidget",
              value: {
                stateType: "searchBoxState",
                stateObject: "Portfolio = '" + filterEvent.activatedData.get("Portfolio").toString() + "'"
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
            name:"detailsWidgetPositions",
            header:"Position details",
            behavior:[],
            dataSource: dsPositions,
            showHeader:true
          },
          {size_x:3, size_y:"*", col:6, row:2},
          this._eventAggregator,
          this._widgetFactory,
          message => { return ("record.Portfolio=='" + message.selectedData.get("Portfolio").toString() + "' " +
            "&& record.SecurityType=='" + message.selectedData.get("SecurityType").toString() + "' " +
            "&& record.BookEndingMarketValue==" + message.selectedData.get("BookEndingMarketValue").toString()
            );
          }
      );
      changeRoureBefavior.attach(dashboard);
      createWidgetBehavior.attach(dashboard);

      return dashboard;
    }

    _getTradesDashboard(params){

        var dsTrades = this._repository.getDatasource("trades");
        var dsPositions = this._repository.getDatasource("positions");


        var tradesGrid = this._widgetFactory.createWidget(Grid, {
            name:"gridWidgetTrades",
            header:"Trades",
            stateStorage: this._stateStorage,
            minHeight: 450,
            pageSize: 40,
            behavior:[
              new DataFilterHandleBehavior("tradesSearchChannel",this._eventAggregator),
              new DataActivatedBehavior("trades-details",this._eventAggregator)
            ],
            dataSource: dsTrades,
              showHeader:true,
              dataFilter:"",
              columns:[
              {
                field: "TradeDate",
                title: "Trade Date",
                format: "{0: MMM.dd yyyy}"
              }
              ,
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
              }
            ]
          });

        //Search box
        var searchBoxName = "tradesSearchWidget";

        // create search box
        var searchBox = this._widgetFactory.createWidget(SearchBox, {
          name:searchBoxName,
          header:"Trades",
          showHeader:false,
          dataSource: dsTrades,
          dataFilter:"",
          stateStorage: this._stateStorage,
          behavior:[
            new DataFilterChangedBehavior("tradesSearchChannel",this._eventAggregator)
          ]
        });


        //var dashboard = new GridsterDashboard("trades");
        var dashboard = new BootstrapDashboard("trades");
        dashboard.title = "Trades";

        dashboard.addWidget(searchBox, {size_x:12, size_y:1, col:1, row:1});
        dashboard.addWidget(tradesGrid, {size_x:12, size_y:'*', col:1, row:2});

        var replaceWidgetBehavior = new ReplaceWidgetBehavior(
            'trades-details',
            this._eventAggregator,
            this._widgetFactory,
            "gridWidgetTrades",
            DetailedView,
            {
              name:"detailsWidgetTrades",
              header:"Trade Details",
              behavior:[],
              dataSource: dsTrades,
              showHeader:true,
              columns:[
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
              ]
            },
            message => { return ("record.TransactionID=='" + message.activatedData.get("TransactionID").toString() + "'"); }
        );
        replaceWidgetBehavior.attach(dashboard);

        return dashboard;
    }
}
