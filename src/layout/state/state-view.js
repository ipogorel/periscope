export class UserStateView {

  constructor(userStateObj) {
    this._stateObject = userStateObj;
  }

  get stateObject(){ return this._stateObject; }
  set stateObject(value){ this._stateObject = value; }
}
