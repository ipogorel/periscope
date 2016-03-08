import {Container, inject} from 'aurelia-framework';
import {Datasource} from 'data/data-source';
import {JsonFileDataService} from 'data/json-file-data-service';
import {Widget} from 'layout/widgets/widget';

@inject(Container)
export class Repository {

  constructor(container) {
    this._container = container;
  }

  getDatasource(name) {
    switch (name.toLowerCase()) {
      case 'positions':
        var jsonFileDataService = this._container.get(JsonFileDataService);
        jsonFileDataService.defaultUrl = '/data/positions.json';
        return new Datasource(name, jsonFileDataService);
      case 'trades':
        var jsonFileDataService = this._container.get(JsonFileDataService);
        jsonFileDataService.defaultUrl = '/data/trades.json';
        return new Datasource(name, jsonFileDataService);
    }
  }
}
