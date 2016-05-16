import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DashboardManager} from './infrastructure/dashboard-manager';
import {PeriscopeRouter} from './navigator/periscope-router';


@inject(DashboardManager, PeriscopeRouter, EventAggregator)
export class Dashboard {
  constructor(dashboardManager, periscopeRouter, eventAggregator) {
    this._router = periscopeRouter;
    this._dashboardManager = dashboardManager;
    this._eventAggregator = eventAggregator;
  }

  attached(){
    var self = this;
    this._eventAggregator.subscribe('router:navigation:complete', (payload) => {
        self.dashboard = self._dashboardManager.find(payload.instruction.params.dashboard);
        if (self.dashboard)
          self.dashboard.refresh();
    });
  }
}
