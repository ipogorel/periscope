import {SchemaProvider} from "./schema-provider"
import Swagger from "swagger-client"
import {Schema} from "../schema"
import * as _ from 'lodash';

export class SwaggerSchemaProvider extends SchemaProvider{
  constructor(definitionUrl, apiName, methodName, modelName){
    super();
    this._modelName = modelName;
    this._methodName = methodName;
    this._apiName = apiName;
    this._definitionUrl = definitionUrl;
  }
  getSchema(){
    var self = this;
    return new Swagger({
      url: this._definitionUrl,
      usePromise: true}).then(client => {
        let result = new Schema();
        _.forEach(client.apis[self._apiName].apis[self._methodName].parameters, p=>{
          result.parameters.push(p);
        });
        if (client.definitions[self._modelName]) {
          _.forOwn(client.definitions[self._modelName].properties, (value, key)=> {
            result.fields.push({field: key, type: value.type});
          });
        }
        return result;
    });
  }
}
