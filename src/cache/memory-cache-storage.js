import {CacheStorage} from './cache-storage'
import lodash from 'lodash';

export class MemoryCacheStorage extends CacheStorage{
  constructor(){
    super();
    this._cache = {}
  }
  setItem(key, value, seconds){
    var t = new Date();
    t.setSeconds(t.getSeconds() + seconds);
    this._cache[key] = {
      value: value,
      exp: t};
  }
  getItem(key){
    return this._cache[key].value;
  }
  removeItem(key){
    delete this._cache[key];
  }
  removeExpired(){
    _.forOwn(this._cache, function(v, k) {
      if (this._cache[k].exp < Date.now()){
        this.removeItem(k);
      }
    });
  }
}
