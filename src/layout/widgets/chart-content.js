import {Query} from './../../data/query'
import {WidgetContent} from './widget-content';
import * as _ from 'lodash';
import $ from 'jquery';
import kendo from 'kendo-ui';

export class ChartContent extends WidgetContent {
  constructor(widget) {
    super(widget);

    var self = this;
    this._chartDataSource = new kendo.data.DataSource({
      type: "json",
      transport: {
        read: options=> {
          let query = new Query();
          query.serverSideFilter = self.widget.dataFilter;
          self.widget.dataSource.getData(query).then(dH=>{
            var a = 1;
            options.success(self.mapData(dH.data, self.settings.categoriesField));
          });
        }
      },
      schema: {
        type: "json"
      }
    });
  }

  refresh(){
    this._chartDataSource.read();
  }

  attached(){
    $(this.chartElement).kendoChart({
      autoBind: false,
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
    $(this.chartElement).data("kendoChart").refresh();
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
