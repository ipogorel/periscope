import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class WidgetFactory
{
  constructor (eventAggregator) {
    this._eventAggregator = eventAggregator;
  }

  createWidget(type, settings) {
    var widget =  new type(settings);
    return widget;
  }

}
