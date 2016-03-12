import {WidgetBehavior} from './widget-behavior';
export class SettingsHandleBehavior extends WidgetBehavior
{
  constructor(channel, eventAggregator, messageMapper) {
    super();
    this._channel = channel;
    this._eventAggregator = eventAggregator;
    this._messageMapper = messageMapper;
  }

  attachToWidget(widget){
    super.attachToWidget(widget);
    var me = this;
    this.subscription = this._eventAggregator.subscribe(this._channel, message => {
      var settingsToApply = me._messageMapper ? me._messageMapper(message) : message;
      me.widget.changeSettings(settingsToApply);
      //me.widget.refresh();
    });
  }

  detach(){
    super.detach(dashboard);
    if (this.subscription)
      this.subscription.dispose();
  }
}
