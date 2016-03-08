import {inject} from 'aurelia-framework';
import {Widget} from 'layout/widgets/widget';
import {EventAggregator} from 'aurelia-event-aggregator';
import {BackButtonPressedBehavior} from 'navigator/widgetbehavior/back-button-pressed-behavior';
import {Repository} from 'data/repository';

@inject(Repository, EventAggregator)
export class WidgetFactory
{
  constructor (repository, eventAggregator) {
    this._repository = repository;
    this._eventAggregator = eventAggregator;
  }

  /*createWidget(name, type, datasourceName, header) {
    var widget =  new Widget(name, type, this._repository.getDatasource(datasourceName), header);
    var backButtonPressed = new BackButtonPressedBehavior(this._eventAggregator)
    backButtonPressed.attachToWidget(widget);
    return widget;
  }*/

  createWidget(type, settings) {
    var widget =  new type(settings);
    var backButtonPressed = new BackButtonPressedBehavior(this._eventAggregator)
    backButtonPressed.attachToWidget(widget);
    return widget;
  }

}
