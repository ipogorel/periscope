import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {BackButtonPressedBehavior} from './../navigator/widgetbehavior/back-button-pressed-behavior';

@inject(EventAggregator)
export class WidgetFactory
{
  constructor (eventAggregator) {
    this._eventAggregator = eventAggregator;
  }

  createWidget(type, settings) {
    var widget =  new type(settings);
    var backButtonPressed = new BackButtonPressedBehavior(this._eventAggregator)
    backButtonPressed.attachToWidget(widget);
    return widget;
  }

}
