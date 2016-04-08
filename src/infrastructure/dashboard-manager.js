import lodash from 'lodash';
import {BootstrapDashboard} from './../layout/bootstrap-dashboard';

export class DashboardManager {
  constructor(){
    this._dashboards = [];
  }

  get dashboards(){
    return this._dashboards;
  }

  find(dashboardName){
    return  _.find(this._dashboards, {name:dashboardName});
  }
  
  createDashboard(name, dashboardConfiguration){
    var dashboard = new BootstrapDashboard(name);
    dashboard.configure(dashboardConfiguration);
    this._dashboards.push(dashboard);
    return dashboard;
  }
}
