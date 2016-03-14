import {DataService} from './data-service'
import {DataHolder} from './data-holder'
import {DataHelper} from '../helpers/data-helper'

export class Datasource {
    
    constructor(datasourceConfiguration) {
        this._name = datasourceConfiguration.name;
        this._transport = datasourceConfiguration.transport;
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

    fill(dataHolder) {
      if ((!this.transport)&&(!this.transport.readService))
        throw "readService is not configured";
      var storage;
      if (this._cache&&this._cache.cacheManager){
        storage = this._cache.cacheManager.getStorage();
        var cachedDataHolder = storage.getItem(dataHolder.cacheKey());
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
            fields: dataHolder.fields,
            filter: dataHolder.query.serverSideFilter,
            take: dataHolder.take,
            skip: dataHolder.skip,
            sort: dataHolder.sort,
            sortDir: dataHolder.sortDir
          })
          .then(d => {
            dataHolder.data = d.data;
            dataHolder.total = d.total;
            if (storage)
              storage.setItem(dataHolder.cacheKey(), {data:dataHolder.data, total:dataHolder.total}, this._cache.cacheTimeSeconds);
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


