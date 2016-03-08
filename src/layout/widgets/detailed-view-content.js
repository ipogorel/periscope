import {inject} from 'aurelia-framework';
import lodash from 'lodash';
import {WidgetContent} from './widget-content';

export class DetailedViewContent extends WidgetContent {

  constructor(widget) {
    super(widget);
    this.columns = widget.settings.columns;
  }

  set data(value) {
    this._data = value[0];
    this.fields = [];
    if (!this._data)
      return;

    if (this.columns) {
      this.fields = _.map(this.columns, c=>{
        return {
          name: c.title ? c.title : c.field,
          value: this._data[c.field]
        }
      })
    }
    else {
      _.forOwn(this._data, (v, k)=>{
        this.fields.push({
          name: k,
          value: v
        });
      })
    }
  }

  set fields(value) {
    this._fields = value;
  }
  get fields() {
    return this._fields;
  }

  set columns(value) {
    this._columns = value;
  }
  get columns() {
    return this._columns;
  }


}
