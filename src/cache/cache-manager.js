import {inject} from 'aurelia-framework';


export class CacheManager{
  constructor(storage){
    this._cacheStorage = storage;
    this._cleanInterval = 5000;
  }

  get cleanInterval() {return this._cleanInterval;}

  startCleaner(){
    if (!this.cleaner) {
      var self = this;
      this.cleaner = window.setInterval(()=> {
        self._cacheStorage.removeExpired();
      }, this._cleanInterval);
    }
  }

  stopCleaner(){
    if (this.cleaner)
      window.clearInterval(this.cleaner);
  }

  getStorage(){
    return this._cacheStorage;
  }
}

