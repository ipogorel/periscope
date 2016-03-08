import {PeriscopeRouter} from '../periscope-router';
import {DashboardBehavior} from './dashboard-behavior';
import {EventAggregator} from 'aurelia-event-aggregator';


export class ChangeRouteBehavior extends DashboardBehavior {
  constructor(settings) {
    super();
    this._chanel = settings.chanel;
    this._eventAggregator = settings.eventAggregator;
    /*this._eventAggregator = container.get(EventAggregator);
    this._router  = container.get(Router);*/
    this._newRoute = settings.newRoute;
    this._router = settings.router;
    this._paramsMapper = settings.paramsMapper;
  }

  attach(dashboard) {
    super.attach(dashboard);
    var me = this;
    this.subscription = this._eventAggregator.subscribe(this._chanel, message => {
      var params = me._paramsMapper ? me._paramsMapper(message) : "";
      if ((params!=="")&&(params.indexOf("?")!=0))
        params="?" + params;
      var navItem = {
          //route: me._newRoute.route,
          route: me._newRoute.route + (params!==""? params : ""),
          title: me._newRoute.title,
          dashboardName: me._newRoute.dashboardName
      }
      me._router.navigate(navItem);
    });
  }

  detach(){
    super.detach(dashboard);
    if (this.subscription)
      this.subscription.dispose();
  }
}

