import {StringHelper} from '../helpers/string-helper'

export class DataHolder {
  constructor(dataSource){
    this._dataSource = dataSource;
  }

  get dataSource(){
    return this._dataSource;
  }

  get data(){
    return this._data;
  }
  set data(value){
    this._data = value;
  }

  get total(){
    return this._total;
  }
  set total(value){
    this._total = value;
  }


  get query(){
    return this._query;
  }
  set query(value){
    this._query = value;
  }

  get sort(){
    return this._sort;
  }
  set sort(value){
    this._sort = value;
  }

  get group(){
    return this._group;
  }
  set group(value){
    this._group = value;
  }

  get sortDir(){
    return this._sort;
  }
  set sortDir(value){
    this._sort = value;
  }

  get take(){
    return this._take;
  }
  set take(value){
    this._take = value;
  }

  get fields(){
    return this._fields;
  }
  set fields(value){
    this._fields = value;
  }

  get skip(){
    return this._skip;
  }
  set skip(value){
    this._skip = value;
  }

  load(){
    return this.dataSource.fill(this).then(dh=>{
      return dh;
    });
  }

  cacheKey(){
    return this._dataSource.name + Math.abs(StringHelper.hashCode(
      (this.query.serverSideFilter?this.query.serverSideFilter:"") +
      (this.sort?this.sort:"") +
      (this.sortDir?this.sortDir:"") +
      (this.take?this.take:"0") +
      (this.skip?this.skip:"0")));
  }
}
