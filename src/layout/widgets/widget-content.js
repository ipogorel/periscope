import {WidgetEvent} from 'navigator/events/widget-event';


export class WidgetContent {
  constructor(widget) {
    this._widget = widget;
  }

  get widget() {
    return this._widget;
  }


  get dataHolder() {
    return this._widget.dataHolder
  }
  set dataHolder(value) {
    this._widget.dataHolder = value;
  }
  get settings() {
    return this.widget.settings;
  }


  refresh(){
    this.dataHolder.cacheKey();
  }

  _calculateHeight(contentRootElement){
    var p = $(contentRootElement).parents(".widget-container")
    var headerHeight = p.find(".portlet-header")[0].scrollHeight;
    var parentHeight = p[0].offsetHeight - headerHeight;
    return parentHeight > this.settings.minHeight? parentHeight : this.settings.minHeight;
  }
}


