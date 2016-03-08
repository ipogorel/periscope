import {WidgetBehavior} from './widget-behavior';
import {WidgetEventMessage} from '../events/widget-event-message';
export class DataFilterChangedBehavior extends WidgetBehavior
{
  constructor(channel, eventAggregator) {
    super();
    this._channel = channel;
    this._eventAggregator = eventAggregator;
  }

  attachToWidget(widget) {
    super.attachToWidget(widget);
    var me = this;
    widget.dataFilterChanged = function(filter)
    {
      var message = new WidgetEventMessage(me.widget.name);
      message.dataFilter = filter;
      me._eventAggregator.publish(me._channel, message);
    };
  }

  detach(){
    super.detach(dashboard);
  }
}
