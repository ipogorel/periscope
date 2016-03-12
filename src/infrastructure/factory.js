import {resolver} from 'aurelia-framework';

@resolver
export class Factory{
  constructor(Type){
    this.Type = Type;
  }

  get(container){
    return (...rest)=>{
      return container.invoke(this.Type, rest);
    };
  }

  static of(Type){
    return new Factory(Type);
  }
}
