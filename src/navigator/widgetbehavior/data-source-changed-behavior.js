import {WidgetBehavior} from './widget-behavior';
import {WidgetEventMessage} from '../events/widget-event-message';
export class DataSourceChangedBehavior extends WidgetBehavior
{
  constructor(channel, eventAggregator) {
    super();
    this._channel = channel;
    this._eventAggregator = eventAggregator;
  }

  attachToWidget(widget) {
    super.attachToWidget(widget);
    var me = this;
    widget.dataSourceChanged = function(dataSource)
    {
      var message = new WidgetEventMessage(me.widget.name);
      message.dataSource = dataSource;
      me._eventAggregator.publish(me._channel, message);
    };
  }

  detach(){
    super.detach(dashboard);
  }
}
