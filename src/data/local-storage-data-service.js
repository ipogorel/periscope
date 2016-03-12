import {DataService} from 'data/data-service';
import {JsonFileQuery} from 'data/query';
import {localDB} from 'mike183/localDB';
import {inject, transient} from 'aurelia-framework';
import {QueryExpressionEvaluator} from '../data/query-expression-evaluator';

export class LocalStorageDataService extends DataService {

  constructor(){
    super();
    this._db = new localdb("periscopeDb");
  }

  get entityType() {
    return this._entityType;
  }
  set entityType(value) {
    this._entityType = value;
    if (!this._db.tableExists(value))
      this._db.createTable(value);
  }

  read(query) {
    var self = this;
    return new Promise((resolve, reject)=>{
      try{
        resolve(self._db.find(self.entityType, query));
      }
      catch (ex){
        reject(ex);
      }
    });
  }

  create(entity) {
    this._db.insert(this.entityType,entity);
  }
  update(id, entity){
    this._db.updateById(this.entityType, entity, id);
  }

  delete(id){
    this._db.removeById(id);
  }

}
