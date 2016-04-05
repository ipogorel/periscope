export class DataService{
  configure(configuration){
    this.url = configuration.url;
    this.schemaProvider = configuration.schemaProvider;
    this.queryMapper = configuration.queryMapper;
    this.totalMapper = configuration.totalMapper;
    this.dataMapper = configuration.dataMapper;
  }
  getSchema(){
    return this.schemaProvider.getSchema();
  }
  read(options) {}
  create(entity) {}
  update(id, entity) {}
  delete(id) {}
}

export class DataServiceConfiguration {

  constructor(options){
    if (options) {
      this._url = options.url;
      this._schemaProvider = options.schemaProvider;
      this._totalMapper = options.totalMapper;
      this._queryMapper = options.queryMapper;
      this._dataMapper = options.dataMapper;
    }
  }

  get url() {
    return this._url;
  }

  get schemaProvider(){
    return this._schemaProvider
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
