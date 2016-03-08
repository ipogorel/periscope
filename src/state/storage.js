/**
 * Created by User on 12/10/2015.
 */
export class Storage{
  constructor(){
    this._provider = this._initProvider('Warning: Local Storage is disabled or unavailable.');
  }
  set(key, value){
    if (this._provider)
     return this._provider.setItem(key, JSON.stringify(value));
    return undefined;
  }
  get(key){

    if (this._provider)
      return  JSON.parse(this._provider.getItem(key));
    return undefined;
  }

  clear(){
    if (this._provider)
      this._provider.clear();
  }

  _initProvider(warning){
    if ('sessionStorage' in window && window['sessionStorage'] !== null) {
      return sessionStorage;
    } else {
      console.warn(warning);
      return undefined;
    }
  }
}
