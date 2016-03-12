export class DataService{

  read(options) {}
  create(entity) {}
  update(id, entity) {}
  delete(id) {}
}

export class DataServiceConfiguration {

  constructor(options){
    if (options) {
      this._url = options.url;
      this._schema = options.schema? options.schema : { fields:[] };
      this._totalMapper = options.totalMapper;
      this._queryMapper = options.queryMapper;
      this._dataMapper = options.dataMapper;
    }
  }

  get url() {
    return this._url;
  }

  get schema() {
    return this._schema;
  }

  get totalMapper(){
    return this._totalMapper;
  }

  get queryMapper(){
    return this._queryMapper;
  }

  get dataMapper(){
    return this._dataMapper;
  }

}
