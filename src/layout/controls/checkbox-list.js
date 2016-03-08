import {customElement, bindable, inject, computedFrom} from 'aurelia-framework';
import lodash from 'lodash';

export class CheckboxList {
  @bindable dataSource = null;
  @bindable captionField = null;
  @bindable checkboxField = null;
  @bindable selectionChanged = null;

  constructor(){

  }

  get filterExpression(){
    return this._filterExpression;
  }
  set filterExpression(value){
    this._filterExpression = value;
  }


  get filteredItems(){
    if (this.filterExpression)
      return _.filter(this.dataSource, x => (x[this.captionField].toLowerCase().indexOf(this._filterExpression.toLowerCase())==0));
    return this.dataSource;
  }

  clicked(item){
    if (this.selectionChanged){
      var obj = {};
      obj[this.captionField] = item[this.captionField];
      obj[this.checkboxField] = item[this.checkboxField];
      this.selectionChanged(obj);
    }
    return true;
  }
}

