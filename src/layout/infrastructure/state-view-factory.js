import {SearchExpressionStateView} from 'state/presentation/search-expression-state-view';
export class StateViewFactory
{
  constructor(){

  }
  createStateView(stateObjectType, stateObject) {
    switch (stateObjectType){
      case "searchBoxState":
            return new SearchExpressionStateView(stateObject);
      default :
            return null;
    }
  }
}
