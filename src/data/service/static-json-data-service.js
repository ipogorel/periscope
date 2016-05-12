import {DataService} from './data-service';
import {DataHelper} from './../../helpers/data-helper';
import {inject, transient} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {QueryExpressionEvaluator} from './../query-expression-evaluator';
import * as _ from 'lodash';

@transient()
@inject(HttpClient)
export class StaticJsonDataService extends DataService {
  constructor(http) {
    super();
    http.configure(config => {
      config.useStandardConfiguration();
    });
    this._http = http;
  }
  

  read(options) {
    return this._http
      .fetch(this.url)
      .then(response => {
        return response.json();
      })
      .then(jsonData => {
        let d = this.dataMapper? this.dataMapper(jsonData) : jsonData;
        if (options.filter){
          let f = options.filter;
          if (_.isArray(f) && this.filterParser && this.filterParser.type === "clientSide")
            f = this.filterParser.getFilter(options.filter);
          let evaluator = new QueryExpressionEvaluator();
          d = evaluator.evaluate(d, f);
        }
        let total = d.length;
        // sort
        if (options.sort)
          d = _.orderBy(d,[options.sort],[options.sortDir]);
        var l = options.skip + options.take;
        d = l? _.slice(d, options.skip, (l>d.length?d.length:l)) : d;
        if (options.fields && options.fields.length>0)
          d = _.map(d, item =>{
            return _.pick(item, options.fields);
          });
        return {
          data: DataHelper.deserializeDates(d),
          total: (this.totalMapper? this.totalMapper(jsonData) : total)
        }
      });
  }

}
