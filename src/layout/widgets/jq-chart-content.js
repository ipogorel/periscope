import {computedFrom} from 'aurelia-framework';
import {WidgetContent} from './widget-content';
import {Query} from './../../data/query'
import * as _ from 'lodash';

export class JqChartContent extends WidgetContent {
  constructor(widget) {
    super(widget);
    this.chartData = {
      labels:[],
      datasets:[]
    }
  }

  get chartData(){
    return this._chartData;
  }
  set chartData(value){
    this._chartData = value;
  }

  refresh(){
    let query = new Query();
    query.serverSideFilter = this.widget.dataFilter;
    this.widget.dataSource.getData(query).then(dH=>{
      this.chartData = this.mapData(dH.data,this.widget.categoriesField);
    });
  }

  mapData(data, categoryField){
    let lbl = [], d = [];
    _.forOwn(_.groupBy(data,categoryField), (v, k)=> {
      lbl.push(k);
      d.push(v.length);
    });
    return {
      labels:lbl,
      datasets:[{
        fillColor:'#ee5315',
        data:d
      }]};
  }

}

