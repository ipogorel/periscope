import {DataService} from '../data/data-service';
import {DataHelper} from '../helpers/data-helper'
import {Query} from '../data/query';
import {inject, transient} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {QueryExpressionEvaluator} from './query-expression-evaluator'
import lodash from 'lodash';

@transient()
@inject(HttpClient)
export class StaticJsonDataService extends DataService {
  constructor(http, configuration) {
    super();
    http.configure(config => {
      config.useStandardConfiguration();
    });
    this._http = http;
    this._configuration = configuration;
  }

  get configuration(){return this._configuration;}

  read(options) {
    var url = this.configuration.url;
    return this._http
      .fetch(this.configuration.url)
      .then(response => {return response.json(); })
      .then(jsonData => {
        var d = jsonData;
        d = this.configuration.dataMapper? this.configuration.dataMapper(d) : d;
        if (options.filter){
          var evaluator = new QueryExpressionEvaluator();
          d = evaluator.evaluate(d, options.filter);
        }
        var l = options.skip + options.take;
        d = l? _.slice(d, options.skip, (l>d.length?d.length:l)) : d;
        if (options.fields && options.fields.length>0)
          d = _.map(d, item =>{
            return _.pick(item, options.fields);
          });
        return {
          data: DataHelper.deserializeDates(d),
          total: (this.configuration.totalMapper? this.configuration.totalMapper(jsonData) : jsonData.length)
        }
      });
  }

}
