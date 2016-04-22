import lodash from 'lodash';

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
  
  createDashboard(type, dashboardConfiguration){
    var dashboard = new type();
    dashboard.configure(dashboardConfiguration);
    this._dashboards.push(dashboard);
    return dashboard;
  }
}
