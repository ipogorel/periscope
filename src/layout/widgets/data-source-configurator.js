import {Widget} from './widget';
import {WidgetEvent} from './../../navigator/events/widget-event';

export class DataSourceConfigurator extends Widget {
  constructor(settings) {
    super(settings);
    this.dataSourceToConfigurate = settings.dataSourceToConfigurate;
    this.stateType = "dataSourceConfiguratorState";
    this._dataSourceChanged = new WidgetEvent();
    this.attachBehaviors();
  }


  get dataSourceToConfigurate(){
    return this._dataSourceToConfigurate;
  }
  set dataSourceToConfigurate(value) {
    this._dataSourceToConfigurate = value;
  }


  get dataSourceChanged() {
    return this._dataSourceChanged;
  }
  set dataSourceChanged(handler) {
    this._dataSourceChanged.attach(handler);
  }


}
