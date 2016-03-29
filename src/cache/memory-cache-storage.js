import {CacheStorage} from './cache-storage'
import _ from 'lodash';

export class MemoryCacheStorage extends CacheStorage{
  constructor(){
    super();
    this._cache = {}
  }
  setItem(key, value, seconds){
    var t = new Date();
    t.setSeconds(t.getSeconds() + seconds);
    var v = _.assign({},value);
    this._cache[key] = {
      value: v,
      exp: t
    };
  }
  getItem(key){
    if (this._cache[key] && this._cache[key].exp >= Date.now())
      return this._cache[key].value;
  }
  removeItem(key){
    delete this._cache[key];
  }
  removeExpired(){
    var self = this;
    _.forOwn(self._cache, function(v, k) {
      if (self._cache[k].exp < Date.now()){
        self.removeItem(k);
      }
    });
  }
}
