import {DataService} from '../data/data-service';
import {DataHelper} from '../helpers/data-helper'
import {Query} from '../data/query';
import {inject, transient} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@transient()
@inject(HttpClient)
export class JsonDataService extends DataService {
    constructor(http, configuration) {
      super();
        http.configure(config => {
            config.useStandardConfiguration();
        });
        this._http = http;
      this._configuration = configuration;
    }

    get configuration(){return this._configuration;}

    read(options) { //options: fields,query, take, skip, sort
        var url = this.configuration.url + (this.configuration.queryMapper? this.configuration.queryMapper(options) : "");
        return this._http
            .fetch(this.configuration.url)
            .then(response => {return response.json(); })
            .then(jsonData => {
                return {
                  data: (this.configuration.dataMapper? this.configuration.dataMapper(jsonData) : jsonData),
                  total: (this.configuration.totalMapper? this.configuration.totalMapper(jsonData) : jsonData.length)
                }
            });
    }
    
}
