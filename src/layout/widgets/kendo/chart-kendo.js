import {Query} from './../../../data/query'
import {Chart} from './../chart';
import * as _ from 'lodash';
import $ from 'jquery';
import kendo from 'kendo-ui';

export class ChartKendo extends Chart {
  constructor(settings) {
    super(settings);

    var self = this;
    this._chartDataSource = new kendo.data.DataSource({
      type: "json",
      transport: {
        read: options=> {
          let query = new Query();
          query.filter = self.dataFilter;
          self.dataSource.getData(query).then(dH=>{
            options.success(self.mapData(dH.data, self.categoriesField));
          });
        }
      },
      schema: {
        type: "json"
      }
    });
  }

  refresh(){
    super.refresh();
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
      seriesDefaults: this.seriesDefaults,
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
