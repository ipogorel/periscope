import {DataService} from './service/data-service'
import * as _ from 'lodash';
import {DataHolder} from './data-holder'
import {DataHelper} from '../helpers/data-helper'

export class Datasource {
    
    constructor(datasourceConfiguration) {
        this._name = datasourceConfiguration.name;
        this._transport = datasourceConfiguration.transport;
        this._schemeConfig = datasourceConfiguration.schemeConfig;
        this._cache = datasourceConfiguration.cache;
    }

    get name() {
        return this._name;
    }

    get transport(){
      return this._transport;
    }

    get cacheManager(){
      return this._cacheManager;
    }

    createDataHolder(){
      return new DataHolder(this);
    }

    cacheOn(cacheKey){
      if (this._cache&&this._cache.cacheManager) {
        var storage = this._cache.cacheManager.getStorage();
        return storage.getItem(cacheKey);
      }
    }

    getData(query) {
      let dataHolder = new DataHolder();
      dataHolder.query = query;

      if ((!this.transport)&&(!this.transport.readService))
        throw "readService is not configured";

      let storage;
      let cacheKey = this.transport.readService.url + query.cacheKey();
      if (this._cache&&this._cache.cacheManager){
        storage = this._cache.cacheManager.getStorage();
        let cachedDataHolder = storage.getItem(cacheKey);
        if (cachedDataHolder) {
          dataHolder.data = cachedDataHolder.data;
          dataHolder.total = cachedDataHolder.total;
          return new Promise((resolve, reject)=> {
            resolve(dataHolder);
          });
        }
      }
      return this.transport.readService.read(
          {
            fields: query.fields,
            filter: (query.serverSideFilter? query.serverSideFilter:""),
            take: query.take,
            skip: query.skip,
            sort: query.sort,
            sortDir: query.sortDir
          })
          .then(d => {
            dataHolder.data = _.isArray(d.data)?d.data : [d.data];
            dataHolder.total = d.total;
            if (storage)
              storage.setItem(cacheKey, {data:dataHolder.data, total:dataHolder.total}, this._cache.cacheTimeSeconds);
            return dataHolder;
      });
    }

    create(entity){
      if ((!this.transport)&&(!this.transport.createService))
        throw "createService is not configured";
      return this.transport.createService.create(entity);
    }

    update(id, entity){
      if ((!this.transport)&&(!this.transport.updateService))
        throw "updateService is not configured";
      return this.transport.updateService.update(id, entity);
    }

    delete(id, entity){
      if ((!this.transport)&&(!this.transport.deleteService))
        throw "deleteService is not configured";
      return this.transport.updateService.delete(entity);
    }
}

export class DataSourceConfiguration {
  get cache(){
    return this._cache;
  }
  set cache(value){
    this._cache = value;
  }

  get transport(){
    return this._transport;
  }
  set transport(value){
    this._transport = value;
  }
  
  get name(){
    return this._name;
  }
  set name(value){
    this._name = value;
  }
}



