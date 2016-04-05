
export class DataHolder {
  constructor(){
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

  // Query object
  get query(){
    return this._query;
  }
  set query(value){
    this._query = value;
  }


}
