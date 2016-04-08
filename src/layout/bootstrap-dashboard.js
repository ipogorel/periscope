import {DashboardBase} from './dashboard-base';
import $ from 'jquery';
import lodash from 'lodash';


export class BootstrapDashboard extends DashboardBase {
  constructor(name) {
    super(name);
    this.widgetBaseHeight = 70;
    this.layoutStructure = [];
  }


  replaceWidget(oldWidget, newWidget, callback){
    super.replaceWidget(oldWidget, newWidget, callback);
    this.layoutStructure = this.createLayoutStructure(this.layoutWidgets);
  }

  addWidget(widget, dimensions){
    super.addWidget(widget, dimensions);
    this.layoutStructure =this.createLayoutStructure(this.layoutWidgets);
  }

  removeWidget(widget){
    super.removeWidget(widget);
    this.layoutStructure = this.createLayoutStructure(this.layoutWidgets);
  }

  resizeWidget(widget, dimensions){
    super.resizeWidget(widget, dimensions);
    this.layoutStructure = this.createLayoutStructure(this.layoutWidgets);
  }

  attached(){
    this.layoutStructure = this.createLayoutStructure(this.layoutWidgets);
  }

  createLayoutStructure(layoutWidgets){
    // sort widgets by row
    var sortedWidgets = _.sortBy(layoutWidgets, function(w) { return w.row; });
    var result = [];
    _.forOwn(_.groupBy(sortedWidgets, 'row'), (v, k)=>{
      // sort widgets by col
      var sortedByCol = _.sortBy(v, function(w) { return w.col; });
      result.push({
        row: k,
        widgets: sortedByCol
      });
    });
    return result;
  }

  getColWidth(layoutWidget){
    if (layoutWidget.size_x==="*") {
      var totalX = _.sumBy(this.layoutWidgets, x => {
        if ((typeof(x.size_x)==='number')&&(x.row==layoutWidget.row))
          return x.size_x;
      });
      var x = 12 - (totalX - (Math.floor(totalX / 12)*12));
      return "col-md-" + (x!=0?x:12);
    }
    return "col-md-" + (layoutWidget.size_x);
  }

  getColHeight(layoutWidget){
    var result = "";
    if (layoutWidget.size_y==="*") { // stretch down to the screen bottom
      // sum all elemets with predefined height
      var totalHeight = _.sumBy(this.layoutWidgets, x => {
        if ((typeof(x.size_y)==='number')&&(layoutWidget.row!==x.row))
          return x.size_y * this.widgetBaseHeight;
      });
      result = "height: " + ($('#dashboard')[0].clientHeight - totalHeight-80) + "px;";
    }
    else{
      if (layoutWidget.size_y>0)
        result = "height: " + (layoutWidget.size_y * this.widgetBaseHeight) + "px;";
    }
    return result;
  }


  openPopup() {
    $(this.popWidgetHost).modal('show');
  }

}



