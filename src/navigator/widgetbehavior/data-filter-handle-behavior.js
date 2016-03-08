import {WidgetBehavior} from './widget-behavior';
export class DataFilterHandleBehavior extends WidgetBehavior
{
  constructor(channel, eventAggregator, filterMapper) {
    super();
    this._channel = channel;
    this._eventAggregator = eventAggregator;
    this._filterMapper = filterMapper;
  }

  attachToWidget(widget){
    super.attachToWidget(widget);
    var me = this;
    this.subscription = this._eventAggregator.subscribe(this._channel, message => {
      var filterToApply = me._filterMapper ? me._filterMapper(message) : message.dataFilter;
      me.widget.dataFilter = filterToApply;
      me.widget.refresh();
    });
  }

  detach(){
    super.detach(dashboard);
    if (this.subscription)
      this.subscription.dispose();
  }
}
