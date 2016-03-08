import lodash from 'lodash';

export class DashboardBase
{
  constructor(name) {
    this._layoutWidgets = [];
    this._behaviors = [];
    this._name = name;
  }

  get name() {
    return this._name;
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
  }

  get layoutWidgets() {
    return this._layoutWidgets;
  }

  get behaviors() {
    return this._behaviors;
  }

  addWidget(widget, dimensions) {
    this._layoutWidgets.push({
      widget: widget,
      size_x: dimensions.size_x,
      size_y: dimensions.size_y,
      col: dimensions.col,
      row: dimensions.row
    })
    widget.dashboard = this;
  }




  getWidgetByName(widgetName) {
    var wl = _.find(this._layoutWidgets, w=> { return w.widget.name === widgetName });
    if (wl)
      return wl.widget;
  }

  getWidgetDimensions(widget){
    var lw = _.find(this._layoutWidgets, w=> { return w.widget === widget });
    return {size_x: lw.size_x, size_y: lw.size_y,  col: lw.col,  row: lw.row};
  }

  removeWidget(widget) {
    _.remove(this._layoutWidgets, w=>{
      if (w.widget === widget) {
        widget.dispose();
        return true;
      }
      return false;
    });
  }

  replaceWidget(oldWidget, newWidget) {
    var lw = _.find(this._layoutWidgets, w=> {return w.widget === oldWidget});
    if (lw){
      newWidget.dashboard = this;
      var newLayoutWidget = {
        widget: newWidget,
        size_x: lw.size_x,
        size_y: lw.size_y,
        col: lw.col,
        row: lw.row
      }
      //oldWidget.dispose();
      this._layoutWidgets.splice(_.indexOf(this._layoutWidgets,lw), 1, newLayoutWidget);
    }
  }

  resizeWidget(widget, dimensions){
    var lw = _.find(this._layoutWidgets, w=> {return w.widget === widget});
    if (!lw)
      return;
    _.forOwn(dimensions, (v,k)=>{
      lw[k] = v;
    });
  }

  refresh() {
    for (let i=0; i<this._layoutWidgets.length; i++) {
      this._layoutWidgets[i].widget.refresh();
    }
  }

  dispose(){
    for (let i=0; i<this._layoutWidgets.length; i++) {
      this._layoutWidgets[i].widget.dispose();
    }
    this._layoutWidgets = [];

    while(true) {
      if (this._behaviors.length>0)
        this._behaviors[0].detach();
      else
        break;
    }
  }
}
