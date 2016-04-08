import {inject, bindable, computedFrom} from 'aurelia-framework';
import {DashboardManager} from './../../infrastructure/dashboard-manager';
import {PeriscopeRouter} from './../../navigator/periscope-router';

@inject(PeriscopeRouter, DashboardManager)
export class DashboardsList {
  constructor(periscopeRouter, dashboardManager){
    this._periscopeRouter = periscopeRouter;
    this._dashboardManager = dashboardManager;
  }

  get dashboards(){
    return this._dashboardManager.dashboards;
  }

  navigate(dashboard){
    this._periscopeRouter.navigate({
        route: dashboard.route,
        title: dashboard.title,
        dashboardName: dashboard.name
      }
    );
  }
}
