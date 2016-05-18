import {DashboardBehavior} from './dashboard-behavior';


export class ChangeRouteBehavior extends DashboardBehavior {
  constructor(settings) {
    super();
    this._chanel = settings.chanel;
    this._eventAggregator = settings.eventAggregator;
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
      me._router.navigate(me._newRoute + (params!==""? params : ""));
    });
  }

  detach(){
    super.detach(dashboard);
    if (this.subscription)
      this.subscription.dispose();
  }
}

