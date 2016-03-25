import {DashboardBase} from './dashboard-base';
import $ from 'jquery';
import gridster from 'gridster';

export class GridsterDashboard extends DashboardBase {
  constructor(name) {
    super(name);
    var self = this;

  }

  attached() {
    var widgetBaseWidth = $(this.layoutContainer).innerWidth()/3;
    this.gridster = $(".gridster").gridster({
      widget_margins: [0, 0],
      widget_base_dimensions: [widgetBaseWidth,90],
      max_cols:3
      /*draggable: {
        stop: function(event, ui){
        }
      }*/
    }).data('gridster');
    this.gridster.disable();
  }

  replaceWidget(oldWidget, newWidget) {
    var self = this;
    var oldElement = self.getWidgetElement(oldWidget.name);
    var oldElementDimensions = {
      size_x: oldElement.attr("data-sizex"),
      size_y: oldElement.attr("data-sizey"),
      col: oldElement.attr("data-col"),
      row: oldElement.attr("data-row")
    };

    this.gridster.remove_widget(oldElement, function(){
      this.replaceWidget(oldWidget, newWidget);
      self._timer = window.setTimeout(function () {
        self.gridster.add_widget.apply(self.gridster, [self.getWidgetElement(newWidget.name), oldElementDimensions.size_x, oldElementDimensions.size_y, oldElementDimensions.col, oldElementDimensions.row]);
      }, 250);
    });
  }

  getWidgetElement(widgetName){
    var selector = "[data-name='" + widgetName + "']";
    return $(selector);
  }


  openPopup() {
    $(this.popWidgetHost).modal('show');
  }

}
