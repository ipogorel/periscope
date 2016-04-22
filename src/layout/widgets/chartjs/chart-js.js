import {computedFrom} from 'aurelia-framework';
import {Chart} from './../chart';
import {Query} from './../../../data/query'
import * as _ from 'lodash';

export class ChartJs extends Chart {
  constructor(widget) {
    super(widget);
    this.chartData = {
      labels:[],
      datasets:[]
    }

    this.obj = {"labels":["Germany","Mexico","UK","Sweden","France","Spain","Canada","Argentina","Switzerland","Brazil","Austria","Italy","Portugal","USA","Venezuela","Ireland","Belgium","Norway","Denmark","Finland","Poland"],"datasets":[{"fillColor":"#ee5315","data":[11,5,7,2,11,5,3,3,2,9,2,3,2,13,4,1,2,1,2,2,1]}]};
  }

  get chartData(){
    return this._chartData;
  }
  set chartData(value){
    this._chartData = value;
  }

  attached(){
  }

  refresh(){
    super.refresh();
    let query = new Query();
    query.serverSideFilter = this.dataFilter;
    this.dataSource.getData(query).then(dH=> {
      this.chartData = this.mapData(dH.data,this.categoriesField);
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

