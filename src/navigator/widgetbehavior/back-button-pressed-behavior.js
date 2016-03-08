import {WidgetBehavior} from './widget-behavior';
import {WidgetEventMessage} from '../events/widget-event-message';

export class BackButtonPressedBehavior extends WidgetBehavior {
  constructor(eventAggregator) {
    super();
    this._eventAggregator = eventAggregator;
  }

  attachToWidget(widget) {
    super.attachToWidget(widget);
    var me = this;
    widget.backButtonPressed =  function(navigationStack)
    {
      var message = new WidgetEventMessage(me.widget.name);
      message.navigationStack = navigationStack;
      me._eventAggregator.publish("widget-back-button-channel", message);
    };
  }

  detach(){
    super.detach(dashboard);
  }
}

