import {computedFrom} from 'aurelia-framework';
import {WidgetEvent} from './../../navigator/events/widget-event';
import lodash from 'lodash';

export class Widget {

  constructor(settings) {
    // call method in child class
    this._settings = settings;
    this._behaviors = [];
    this._navigationStack = [];

    this._backButtonPressed = new WidgetEvent();
    this._dataSelected = new WidgetEvent();
    this._dataActivated = new WidgetEvent();
    this._dataFilterChanged = new WidgetEvent();
    this._dataFieldSelected = new WidgetEvent();
    this._dataSourceChanged = new WidgetEvent();

    this.attachBehaviors(this.settings.behavior);
    this._resized = false;
  }

  get self() {
    return this;
  }

  get settings(){
    return this._settings;
  }

  get content() {
    return this.contentViewModel;
  }
  set content(value){
    this.contentViewModel = value;
  }

  get behaviors() {
    return this._behaviors;
  }

  get name(){
    return this.settings.name;
  }


  get state() {
    if (this.stateStorage) {
      var key = this.stateStorage.createKey(this.dashboard.name, this.name);
      var s = this.stateStorage.get(key);
      if (s)
        return s.stateObject;
    }
    return undefined;
  }

  set state(value) {
    if (this.stateStorage) {
      var key = this.stateStorage.createKey(this.dashboard.name, this.name);
      if (!value)
        this.stateStorage.remove(key);
      else
      {
        var s = {stateType: this.stateType, stateObject: value};
        this.stateStorage.set(key, s);
      }
    }
  }

  get stateType() {
    return this._type;
  }
  set stateType(value) {
    this._type = value;
  }

  get showHeader(){
    return this.settings.showHeader;
  }

  set dataHolder(value){
    this._dataHolder = value;
  }
  get dataHolder(){
    return this._dataHolder;
  }

  

  @computedFrom('navigationStack')
  get hasNavStack() {
    return this.navigationStack && this.navigationStack.length > 0;
  }

  get header() {
    return this.settings.header;
  }

  get resized() {
    return this._resized;
  }
  set resized(value) {
    this._resized = value;
  }

  get stateStorage(){
    return this.settings.stateStorage;
  }


  set dataSource(value) {
    this.settings.dataSource = value;
  }
  get dataSource() {
    return this.settings.dataSource;
  }

  get dataMapper() {
    return this.settings.dataMapper;
  }

  get dataFilter() {
    return this._dataFilter;
  }

  set dataFilter(value) {
    this._dataFilter = value;
  }

  get type() {
    return this._type;
  }

  get dashboard() {
    return this._dashboard;
  }
  set dashboard(value) {
    this._dashboard = value;
  }


  get navigationStack() {
    return this._navigationStack;
  }

  set navigationStack(value) {
    this._navigationStack = value;
  }

  attachBehaviors(behaviors){
    if (behaviors) {
      for (let b of behaviors)
        b.attachToWidget(this);
    }
  }

  ///METHODS
  changeSettings(newSettings){
    if (newSettings) {
      //merge settings
      _.forOwn(newSettings, (v, k)=> {
        this.settings[k] = v;
      });
      this.refresh();
    }
  }

  resize(){
    if (!this.resized) {
      this._originalDimensions = this._dashboard.getWidgetDimensions(this);
      this._dashboard.resizeWidget(this, {size_x: 12});
    }
    else
      this._dashboard.resizeWidget(this,this._originalDimensions);
    this.resized = !this.resized;
  }

  remove() {
    if (this._dashboard != undefined)
      this._dashboard.removeWidget(this);
  }


  refresh() {
    this.content.refresh();
  }

  back() {
    if (this._backButtonPressed)
      this.backButtonPressed.raise(this.navigationStack);
  }


  dispose(){
    while(true) {
      if (this.behaviors.length>0)
        this.behaviors[0].detach();
      else
        break;
    }
  }

  /// EVENTS
  get backButtonPressed() {
    return this._backButtonPressed;
  }
  set backButtonPressed(handler) {
    this._backButtonPressed.attach(handler);
  }

  get dataFieldSelected() {
    return this._dataFieldSelected;
  }
  set dataFieldSelected(handler) {
    this._dataFieldSelected.attach(handler);
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

  get dataFilterChanged() {
    return this._dataFilterChanged;
  }
  set dataFilterChanged(handler) {
    this._dataFilterChanged.attach(handler);
  }
  get dataSourceChanged() {
    return this._dataSourceChanged;
  }
  set dataSourceChanged(handler) {
    this._dataSourceChanged.attach(handler);
  }
}



