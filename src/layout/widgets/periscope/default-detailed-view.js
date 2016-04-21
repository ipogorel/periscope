import * as _ from 'lodash';
import {Query} from './../../../data/query'
import {DetailedView} from './../detailed-view';

export class DefaultDetailedView extends DetailedView {

  constructor(settings) {
    super(settings);
  }

  get data(){
    return this._data;
  }
  set data(value){
    this._data = value;
  }

  get viewFields() {
    var result = []
    if (!this.data)
      return result;
    if (this.fields) {
      result = _.map(this.fields, c=>{
        return {
          name: c.title ? c.title : c.field,
          value: this.data[c.field]
        }
      })
    }
    else {
      _.forOwn(this.data, (v, k)=>{
        result.push({
          name: k,
          value: v
        });
      })
    }
    return result;
  }


  refresh(){
    let q = new Query();
    q.take = 1;
    q.skip = 0;
    q.serverSideFilter = this.dataFilter;
    this.dataSource.getData(q).then(dH=>{
      if (dH.data.length>0)
        this.data = dH.data[0];
    })
  }
}
