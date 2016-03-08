import {WidgetEvent} from 'navigator/events/widget-event';


export class WidgetContent {
  constructor(widget) {
    this._widget = widget;
  }

  get widget() {
    return this._widget;
  }


  // owerride this in child widgets
  set data(value) {
  }
  // end owerride


  get settings() {
    return this.widget.settings;
  }



  _calculateHeight(contentRootElement){
    var p = $(contentRootElement).parents(".widget-container")
    var headerHeight = p.find(".portlet-header")[0].scrollHeight;
    var parentHeight = p[0].offsetHeight - headerHeight;
    return parentHeight > this.settings.minHeight? parentHeight : this.settings.minHeight;
  }
}


