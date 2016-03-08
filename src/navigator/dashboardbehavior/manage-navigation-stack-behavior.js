import {DashboardBehavior} from './dashboard-behavior';

export class ManageNavigationStackBehavior extends DashboardBehavior {
  constructor(eventAggregator) {
    super();
    //this._chanel = chanel;
    this._eventAggregator = eventAggregator;
  }
  attach(dashboard) {
    super.attach(dashboard);
    var me = this;

    //this._eventAggregator.subscribe(BackButtonEvent, event => {
    this.subscription = this._eventAggregator.subscribe("widget-back-button-channel", message => {
      var originatorWidget = dashboard.getWidgetByName(message.originatorName);
      if (originatorWidget) {
        var previousWidget = message.navigationStack.pop();
        dashboard.replaceWidget(originatorWidget,previousWidget);
      }
    });
  }

  detach(){
    super.detach(dashboard);
    if (this.subscription)
      this.subscription.dispose();
  }
}

