import {WidgetContent} from './widget-content';
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
          self.dataHolder.load().then(d=> {
            self.dataHolder.data = self.mapData(self.dataHolder.data, self.settings.categoriesField);
            //var d  = {data: self.mapData(self.dataHolder.data, self.settings.categoriesField)};
            options.success(self.dataHolder);
          });
        }
      },
      schema: {
        type: "json",
        data: "data"
      }
    });
  }

  refresh(){
    this._chartDataSource.read();
  }

  attached() {
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
        max: 100,
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
