import {WidgetFactory} from 'layout/infrastructure/widget-factory';
import {DashboardBehavior} from './dashboard-behavior';

export class ReplaceWidgetBehavior extends DashboardBehavior  {

  constructor(chanel, eventAggregator, widgetFactory, widgetToReplaceName, widgetType, widgetSettings, mapper) {
    super();
    this._chanel = chanel;
    this._widgetType = widgetType;
    this._widgetSettings = widgetSettings;
    this._eventAggregator = eventAggregator;
    this._widgetFactory = widgetFactory;
    this._widgetToReplaceName = widgetToReplaceName;
    this._mapper = mapper;
  }

  attach(dashboard){
    super.attach(dashboard);
    var me = this;
    this.subscription = this._eventAggregator.subscribe(this._chanel, message => {
      var originatorWidget = dashboard.getWidgetByName(me._widgetToReplaceName);
      var w = me._widgetFactory.createWidget(me._widgetType, me._widgetSettings);
      w.navigationStack.push(originatorWidget);
      dashboard.replaceWidget(originatorWidget, w);
      if (me._mapper)
        w.dataFilter =  me._mapper(message);
      w.refresh();
    });
  }

  detach(){
    super.detach(dashboard);
    if (this.subscription)
      this.subscription.dispose();
  }
}
