import {Container} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DashboardBehavior} from './dashboard-behavior';

export class CreateWidgetBehavior extends DashboardBehavior {

  constructor(chanel, widgetType, widgetSettings, widgetDimensions, eventAggregator, widgetFactory, filterMapper) {
    super();
    this._chanel = chanel;
    this._widgetType = widgetType;
    this._widgetSettings = widgetSettings;
    this._widgetDimensions = widgetDimensions;
    this._eventAggregator = eventAggregator;
    this._widgetFactory = widgetFactory;
    this._filterMapper = filterMapper;
  }

  attach(dashboard){
    super.attach(dashboard);
    var me = this;
    this.subscription = this._eventAggregator.subscribe(this._chanel, message => {
      //make sure the widget exists
      var w = dashboard.getWidgetByName(me._widgetSettings.name);
      if(!w){ //widget not exist.
        var w = this._widgetFactory.createWidget(me._widgetType, me._widgetSettings);
        dashboard.addWidget(w, this._widgetDimensions);
      }
      w.dataFilter =  me._filterMapper ? me._filterMapper(message) : "";
      w.refresh();

    });
  }

  detach(){
    super.detach(dashboard);
    if (this.subscription)
      this.subscription.dispose();
  }


}
