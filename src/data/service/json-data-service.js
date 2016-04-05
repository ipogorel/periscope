import {DataService} from './data-service';
import {DataHelper} from '../../helpers/data-helper'
import {Query} from '../query';
import {inject, transient} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@transient()
@inject(HttpClient)
export class JsonDataService extends DataService {
    constructor(http) {
      super();
        http.configure(config => {
            config.useStandardConfiguration();
        });
        this._http = http;
    }

    read(options) { //options: fields,query, take, skip, sort
        var url = this.url + (this.queryMapper? this.queryMapper(options) : "");
        return this._http
            .fetch(this.url)
            .then(response => {return response.json(); })
            .then(jsonData => {
                return {
                  data: (this.dataMapper? this.dataMapper(jsonData) : jsonData),
                  total: (this.totalMapper? this.totalMapper(jsonData) : jsonData.length)
                }
            });
    }
}
