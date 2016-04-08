import {computedFrom} from 'aurelia-framework';
import {Datasource} from './../../data/data-source';
import {SwaggerSchemaProvider} from './../../data/schema/providers/swagger-schema-provider'
import {WidgetContent} from './widget-content';
import Swagger from "swagger-client"
import * as _ from 'lodash';

export class DataSourceConfiguratorContent extends WidgetContent {
  constructor(widget){
    super(widget);
    this.definitionUrl = widget.settings.definitionsUrl.trim();
    this._initSwaggerClient(this.definitionUrl);
  }

  get client(){
    return this._client;
  }
  set client (value){
    this._client = value;
  }


  get definitionUrl(){
    return this._definitionUrl;
  }
  set definitionUrl(value){
    this._definitionUrl = value;
  }

  get apis(){
    if (this.client)
      return _.map(this.client.apisArray,'name');
    else
      return [];
  }
  @computedFrom("api")
  get methods(){
    if (this.client && this.api){
      let m = []
      _.forOwn(this.client.apis[this.api].apis, a=>{
        if (a.method.toLowerCase() === "get")
          m.push(a.nickname);
      })
      return m;
    }
    else
      return [];
  }

  @computedFrom("method")
  get parameters(){
    if (this.client && this.method && this.api){
      return this.client.apis[this.api].apis[this.method].parameters;
    }
    else
      return [];
  }
  set parameters(value){
    this._parameters = value;
  }

  get api(){
    return this._api;
  }
  set api(value){
    this._api = value;
  }
  get method(){
    return this._method;
  }
  set method(value){
    this._method = value;
  }


  submit(){
    if (!this.widget.settings.dataSourceToConfigurate)
      throw "dataSourceToConfigurate is not provided";
    let ds = this.widget.settings.dataSourceToConfigurate;
    let url = this.client.scheme + "://" + this.client.host + this.client.basePath + this.client.apis[this.api].apis[this.method].path;

    let queryParams = _.map(_.filter(this.parameters, x=>{ return (x.value && x.in == "query")} ), p=>{
      if (p.value)
        return p.name + "=" + p.value
    });

    let definitionModelName;
    let responseDef = this.client[this.api].apis[this.method].successResponse["200"].definition;
    if (responseDef.type === "array") {
      if (responseDef.items.$ref.indexOf('#/definitions/') === 0) {
        if (this.client.definitions[responseDef.items.$ref.substring('#/definitions/'.length)])
          definitionModelName = this.client.definitions[responseDef.items.$ref.substring('#/definitions/'.length)].name;
      }
    }
    else if (responseDef.name){
      definitionModelName = responseDef.name;
    }


    _.forEach(_.filter(this.parameters, x=>{ return (x.value && x.in == "path")}), pathParam=>{
      url = url.replace("{" + pathParam.name + "}", pathParam.value);
    })


    if (queryParams.length>0)
      url = url + "?" + queryParams.join("&");

    ds.transport.readService.configure({
        url: url,
        schemaProvider: new SwaggerSchemaProvider(this.definitionUrl, this.api, this.method, definitionModelName)
    });
    this.widget.dataSourceChanged.raise(ds);
  }

  _initSwaggerClient(url){
    return new Swagger({
      url: url,
      usePromise: true}).then(client => {
        this.client = client;
    })
  }
}
