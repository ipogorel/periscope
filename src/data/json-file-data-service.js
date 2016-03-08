import {DataService} from '../data/data-service';
import {DataHelper} from '../helpers/data-helper'
import {JsonFileQuery} from '../data/query';
import {inject, transient} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(HttpClient)
@transient()
export class JsonFileDataService extends DataService {

    constructor(http) {
      super();
        http.configure(config => {
            config.useStandardConfiguration();
        });
        this._http = http;
    }

    get defaultUrl() {
        return this._defaultUrl;
    }

    set defaultUrl(value) {
        this._defaultUrl = value;
    }


    read(query) {
        var url = (query && query.url) || this.defaultUrl;
        return this._http
            .fetch(url)
            .then(response => {return response.json(); })
            .then(jsonData => {return DataHelper.deserializeDates(jsonData);});
    }
    
}
