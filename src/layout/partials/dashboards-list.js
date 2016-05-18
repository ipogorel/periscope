import {inject} from 'aurelia-framework';
import {DashboardManager} from './../../infrastructure/dashboard-manager';
import {Router} from 'aurelia-router';

@inject(Router, DashboardManager)
export class DashboardsList {
  constructor(router, dashboardManager){
    this._router = router;
    this._dashboardManager = dashboardManager;
  }

  get dashboards(){
    return this._dashboardManager.dashboards;
  }

  navigate(dashboard){
    this._router.navigate(dashboard.route);
  }
}
