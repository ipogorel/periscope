import {WidgetBehavior} from './widget-behavior';
export class DataSourceHandleBehavior extends WidgetBehavior
{
  constructor(channel, eventAggregator) {
    super();
    this._channel = channel;
    this._eventAggregator = eventAggregator;
  }

  attachToWidget(widget){
    super.attachToWidget(widget);
    var me = this;
    this.subscription = this._eventAggregator.subscribe(this._channel, message => {
      me.widget.dataSource = message.dataSource;
      me.widget.refresh();
    });
  }

  detach(){
    super.detach(dashboard);
    if (this.subscription)
      this.subscription.dispose();
  }
}

