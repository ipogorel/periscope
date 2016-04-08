export class WidgetContent {
  constructor(widget) {
    this._widget = widget;
  }

  get widget() {
    return this._widget;
  }

  get settings() {
    return this.widget.settings;
  }

  refresh(){
    
  }

  _calculateHeight(contentContainerElement){
    if (!contentContainerElement)
      return this.settings.minHeight;
    var p = $(contentContainerElement).parents(".widget-container")
    var headerHeight = p.find(".portlet-header")[0].scrollHeight;
    var parentHeight = p[0].offsetHeight - headerHeight;
    return parentHeight > this.settings.minHeight? parentHeight : this.settings.minHeight;
  }
}


