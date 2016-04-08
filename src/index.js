import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DashboardManager} from './infrastructure/dashboard-manager';
import {PeriscopeRouter} from './navigator/periscope-router';
import {UserStateStorage} from './state/user-state-storage';


@inject(DashboardManager, PeriscopeRouter, EventAggregator, UserStateStorage)
export class Index {

  constructor(dashboardManager, periscopeRouter, eventAggregator, userStateStorage) {
    this._router = periscopeRouter;
    this._dashboardManager = dashboardManager;
    this._eventAggregator = eventAggregator;
    this._userStateStorage = userStateStorage;
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
        self.dashboard = self._dashboardManager.find(payload.instruction.params.dashboard);
        //self.dashboard = _.find(self._dashboardManager.dashboards, {"route": "/" + payload.instruction.params.dashboard});
        if (self.dashboard)
          self.dashboard.refresh();
      }
    });

  }
}
