import {DataService} from './data-service';
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

    read(options) { //options: fields,filter, take, skip, sort
        let url = this.url
        if (options.filter)
          url+= (this.filterParser? this.filterParser.getFilter(options.filter) : "");
        return this._http
            .fetch(url)
            .then(response => {return response.json(); })
            .then(jsonData => {
                return {
                  data: (this.dataMapper? this.dataMapper(jsonData) : jsonData),
                  total: (this.totalMapper? this.totalMapper(jsonData) : jsonData.length)
                }
            });
    }
}
