import {customElement, inject, useView} from 'aurelia-framework';
import {Widget} from './widget';

export class DetailedView extends Widget {
  constructor(settings) {
    super(settings);
    this.fields = settings.fields;
    this.stateType = "detailedViewState";
    this.attachBehaviors();
  }

  get fields(){
    return this._fields;
  }
  set fields(value) {
    this._fields = value;
  }
}

