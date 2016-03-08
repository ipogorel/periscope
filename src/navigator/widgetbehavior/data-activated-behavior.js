import {WidgetBehavior} from './widget-behavior';
import {WidgetEventMessage} from '../events/widget-event-message';

export class DataActivatedBehavior extends WidgetBehavior {
  constructor(chanel, eventAggregator) {
    super();
    this._chanel = chanel;
    this._eventAggregator = eventAggregator;
  }

  attachToWidget(widget)   {
    super.attachToWidget(widget);
    var me = this;

    widget.dataActivated =  function(currentRecord) {
      var message = new WidgetEventMessage(me.widget.name);
      message.activatedData = currentRecord;
      me._eventAggregator.publish(me._chanel, message);
    };
  }

  detach(){
    super.detach(dashboard);
  }
}
