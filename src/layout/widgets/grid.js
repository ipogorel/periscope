import {Decorators, customElement, bindable, inject, useView, noView} from 'aurelia-framework';
import {Widget} from './widget';
import {WidgetEvent} from './../../navigator/events/widget-event';

export class Grid extends Widget {
  constructor(settings) {
    super(settings);

    this.columns = settings.columns? settings.columns : [];
    this.navigatable = settings.navigatable;
    this.autoGenerateColumns = settings.autoGenerateColumns;
    this.pageSize = settings.pageSize;
    this.group = settings.group;

    this.stateType = "gridState";

    this._dataSelected = new WidgetEvent();
    this._dataActivated = new WidgetEvent();
    this._dataFieldSelected = new WidgetEvent();

    this.attachBehaviors();
  }

  get columns(){
    return this._columns;
  }
  set columns(value) {
    this._columns = value;
  }

  get navigatable(){
    return this._navigatable;
  }
  set navigatable(value) {
    this._navigatable = value;
  }

  get autoGenerateColumns(){
    return this._autoGenerateColumns;
  }
  set autoGenerateColumns(value) {
    this._autoGenerateColumns = value;
  }

  get pageSize(){
    return this._pageSize;
  }
  set pageSize(value) {
    this._pageSize = value;
  }

  get group(){
    return this._group;
  }
  set group(value){
    this._group = value;
  }

  get dataSelected() {
    return this._dataSelected;
  }
  set dataSelected(handler) {
    this._dataSelected.attach(handler);
  }

  get dataActivated() {
    return this._dataActivated;
  }
  set dataActivated(handler) {
    this._dataActivated.attach(handler);
  }
  

  get dataFieldSelected() {
    return this._dataFieldSelected;
  }
  set dataFieldSelected(handler) {
    this._dataFieldSelected.attach(handler);
  }

  saveState(){
    this.state = {columns:this.columns};
  }

  restoreState(){
    if (this.state)
      this.columns = this.state.columns;
  }
}
