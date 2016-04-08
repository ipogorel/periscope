import {Storage} from './storage';
import {AppConfig} from './../app-config';
import {inject} from 'aurelia-framework';
import lodash from 'lodash';

@inject(Storage, AppConfig)
export class UserStateStorage{

    constructor(storage, config){
      this._storage = storage;
      this._key = config.appStorageKey;
    }


    getAll (namespace){
      var data = this._storage.get(this._key);
      if (data) {
        if (!namespace)
          return data;
        namespace = this._createFullNamespace(namespace);
        return _.filter(data, x => (x.key.indexOf(namespace)===0));
      }
      return [];
    }

    get(key){
      var o = this._getObj(key);
      if (o)
        return o.value;
      return undefined;
    }

    set(key, value){
      var all = this.getAll();
      var oldState = {key};
      var newState = {key, value};
      var item = _.find(all, {'key': key});
      if (item) {
        oldState.value = item.value;
        item.value = value;
      }
      else
        all.push({key: key, value: value});
      this._storage.set(this._key, all);
    }

    remove(key){
      var all = this.getAll();
      _.remove(all, function(i){
          return i.key == key;
        }
      );
      this._storage.set(this._key, all);
    }


    clearAll(){
      this._storage.clear();
    }

    createKey(namespace, key){
      return this._createFullNamespace(namespace) + key;
    }

    _createFullNamespace(namespace){
      return namespace + ":";
    }

    _getObj(k){
      var data = this.getAll();
      var obj = _.find(data,  {'key':k});
      return obj;
    }

}
