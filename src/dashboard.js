import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DashboardManager} from './infrastructure/dashboard-manager';


@inject(DashboardManager, EventAggregator)
export class Dashboard {
  constructor(dashboardManager, eventAggregator) {
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
