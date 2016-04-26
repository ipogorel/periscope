import {customElement, useView} from 'aurelia-framework';
import {Widget} from './widget';
import {WidgetEvent} from './../../navigator/events/widget-event';

export class SearchBox extends Widget {
  constructor(settings) {
    super(settings);
    this.stateType = "searchBoxState";
    this._dataFilterChanged = new WidgetEvent();
    this.attachBehaviors();
  }

  get dataFilterChanged() {
    return this._dataFilterChanged;
  }
  set dataFilterChanged(handler) {
    this._dataFilterChanged.attach(handler);
  }



}
