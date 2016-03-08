export class Query {

  get clientSideFilter() {
    return this._clientSideFilter;
  }

  set clientSideFilter(value) {
    this._clientSideFilter = value;
  }
}

export class JsonFileQuery extends Query {

  constructor(url) {
    super();
    this._url = url;
  }

  get url() {
    return this._url;
  }

}
