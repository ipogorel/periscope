import {UrlHelper} from 'helpers/url-helper'

export class StateUrlParser{
  static stateToQuery(widgetStates){
    var params = []
    for (let widgetState of widgetStates)
        params.push({"sk": widgetState.key, "sv":widgetState.value});
    //.widgetName, "st":widgetState.value.stateType, "so":widgetState.value.stateObject
    return ((params.length>0)? "?q=" + UrlHelper.objectToQuery(params) :"");
  }

  static queryToState(url){
    var result = [];
    var q = UrlHelper.getParameterByName("q", url);
    if (q){
      var widgetStates = UrlHelper.queryToObject(q);
      for (var ws of widgetStates){
        result.push({"key":ws.sk, "value":ws.sv});
      }
    }
    return result;
  }
}
