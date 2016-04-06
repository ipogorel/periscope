import * as _ from 'lodash';
import {Query} from './../../data/query'
import {WidgetContent} from './widget-content';

export class DetailedViewContent extends WidgetContent {

  constructor(widget) {
    super(widget);
    this.columns = widget.settings.columns;

  }

  get data(){
    return this._data;
  }
  set data(value){
    this._data = value;
  }

  get fields() {
    var result = []
    if (!this.data)
      return result;
    if (this.columns) {
      result = _.map(this.columns, c=>{
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

  set columns(value) {
    this._columns = value;
  }
  get columns() {
    return this._columns;
  }

  refresh(){
    let q = new Query();
    q.take = 1;
    q.skip = 0;
    q.serverSideFilter = this.widget.dataFilter;
    this.widget.dataSource.getData(q).then(dH=>{
      if (dH.data.length>0)
        this.data = dH.data[0];
    })
  }
}
