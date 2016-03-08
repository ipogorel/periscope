import {inject} from 'aurelia-framework';
import {WidgetContent} from './widget-content';
import lodash from 'lodash';
import $ from 'jquery';
import kendo from 'kendo-ui';

export class ChartContent extends WidgetContent {
  constructor(widget) {
    super(widget);
    this._chartDataSource = new kendo.data.DataSource({});
  }

  set data(value) {
    this._chartDataSource.data(this.mapData(value, this.settings.categoriesField));
  }

  attached() {
    $(this.chartElement).kendoChart({
      dataSource: this._chartDataSource,
      legend: {
        visible: true
      },
      chartArea: {
        height: this._calculateHeight(this.chartElement)
      },
      seriesDefaults: this.settings.seriesDefaults,
      series: [{
        field: "value"
      }],
      valueAxis: {
        max: 1000,
        majorGridLines: {
          visible: false
        },
        visible: true
      },
      categoryAxis: {
        field: "field",
        majorGridLines: {
          visible: false
        },
        line: {
          visible: true
        }
      }
    });
  }

  mapData(data, categoryField){
    var result = []
    _.forOwn(_.groupBy(data,categoryField), (v, k)=> {
      result.push({
        field: k,
        value: v.length
      });
    });
     return result;
      }


}
