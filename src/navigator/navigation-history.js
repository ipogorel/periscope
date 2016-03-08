export class NavigationHistory {
  constructor() {
    this._history = [];
  }



  get items(){
    return this._history;
  }


  add(url, title, dashboard, state, dateTime) {
    this._history.push({url, title, dashboard, state, dateTime});
  }



  update(url, dateTime){
    for (let h of this._history){
      if (h.url === url) {
        h.dateTime = dateTime;
        break;
      }
    }
  }

  delete(url){
    for (let i of this._history){
      if (i.url === url) {
        this._history.splice(i, 1);
        break;
      }
    }
  }

  deleteAll(){
    this._history = [];
  }

  trimRight(url){
    for (let i = this._history.length - 1; i >= 0; i--) {
      if (this._history[i].url === url) {
        this._history.splice(i + 1);
        return;
      }
    }
  }

  exists(url) {
    for (let i of this._history){
      if (i.route === url)
        return true;
    }
    return false;
  }



}
