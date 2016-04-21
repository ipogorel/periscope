import {customElement, inject, useView} from 'aurelia-framework';
import {Widget} from './widget';

export class Chart extends Widget {
  constructor(settings) {
    super(settings);
    this.categoriesField = settings.categoriesField;
    this.seriesDefaults = settings.seriesDefaults;
    this.stateType = "chartState";
    this.attachBehaviors();
  }

  get categoriesField(){
    return this._categoriesField;
  }
  set categoriesField(value){
    this._categoriesField = value;
  }

  get seriesDefaults(){
    return this._seriesDefaults;
  }
  set seriesDefaults(value){
    this._seriesDefaults = value;
  }

}
