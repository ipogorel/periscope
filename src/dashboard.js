import {inject, bindable} from 'aurelia-framework';
import {PeriscopeRouter} from 'navigator/periscope-router';
import {DashboardFactory} from 'layout/infrastructure/dashboard-factory';
import {EventAggregator} from 'aurelia-event-aggregator';
import {UserStateStorage} from 'state/user-state-storage';

@inject(DashboardFactory, PeriscopeRouter, EventAggregator, UserStateStorage)
export class Index {

  constructor(dashboardFactory, router, eventAggregator, userStateStorage) {
    this._dashboardFactory = dashboardFactory;
    this._router = router;
    this._eventAggregator = eventAggregator;
    this._userStateStorage = userStateStorage;
    //this._defaultDashboard = "default";
  }

  createDashboard(dashboardName, params) {
    if ((!dashboardName)||(dashboardName===""))
      return;
    var dashboard = this._dashboardFactory.getDashboard(dashboardName, params);
    dashboard.refresh();
    return dashboard;
  }


  attached(){
    var self = this;
    this._eventAggregator.subscribe('router:navigation:complete', (payload) => {
      if (!payload.instruction.params.dashboard){ // first load
        this._userStateStorage.clearAll();
        self._router.navigate({
          title: "Customers",
          route: "/customers",
          dashboardName: "customers"
        });
      }
      else
      {
        if (self.dashboard)
          self.dashboard.dispose();
        self.dashboard = self.createDashboard(payload.instruction.params.dashboard, payload.instruction.queryParams);
      }
    });
  }

  /*activate(params){
    var self = this;
    if (!params.dashboard){
      self._router.navigate({
        title: "Positions",
        route: "/positions",
        dashboardName: "positions"
      });
    }
    else
      self.dashboard = self.createDashboard(params.dashboard, params);
  }


  deactivate(){
    if (this.dashboard)
      this.dashboard.dispose();
  }*/
}

