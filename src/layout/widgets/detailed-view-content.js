import {inject} from 'aurelia-framework';
import lodash from 'lodash';
import {WidgetContent} from './widget-content';

export class DetailedViewContent extends WidgetContent {

  constructor(widget) {
    super(widget);
    this.columns = widget.settings.columns;

  }


  get fields() {
    var result = []
    if (!this.dataHolder.data || !this.dataHolder.data[0])
      return result;
    var _data = this.dataHolder.data[0];
    if (this.columns) {
      result = _.map(this.columns, c=>{
        return {
          name: c.title ? c.title : c.field,
          value: _data[c.field]
        }
      })
    }
    else {
      _.forOwn(_data, (v, k)=>{
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


}
