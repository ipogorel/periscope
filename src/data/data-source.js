import {QueryExpressionEvaluator} from '../data/query-expression-evaluator';
import {DataHelper} from '../helpers/data-helper'

export class Datasource {
    
    constructor(name, dataService) {
        this._name = name;
        this._dataService = dataService;
    }

    get name() {
        return this._name;
    }


    getMetadata(){
      /*if (!this._metadata){
        return this.getData(query).then(d => {
          this._metadata = {fields:[]};
          for (let x in d[0])
            this._metadata.fields.push({field:x, type:DataHelper.getFieldType(d,x)});
          return this._metadata;
        });
      }
      else{
        return new Promise((resolve, reject)=>{
          resolve(this._metadata);
        });
      }*/
      return this.getData().then(d => {
        this._metadata = {fields:[]};
        for (let x in d[0])
          this._metadata.fields.push({field:x, type:DataHelper.getFieldType(d,x)});
        return this._metadata;
      });
    }


    getData(query) {
        return this._dataService
            .read(query)
            .then(d=>{
                //client-side filtration
                //TODO: add a property (e.g. Query.Filter, to enable both server- and client-side filters)
                if (!query || !query.clientSideFilter) {
                    return d;
                }
                else {
                    var evaluator = new QueryExpressionEvaluator();
                    return evaluator.evaluate(d, query.clientSideFilter);
                }
             });
    }
}
