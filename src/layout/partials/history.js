import {inject, bindable, computedFrom} from 'aurelia-framework';
import {PeriscopeRouter} from './../../navigator/periscope-router';
import {NavigationHistory} from './../../navigator/navigation-history';
import {StateViewFactory} from './../../infrastructure/state-view-factory';

@inject(PeriscopeRouter, NavigationHistory, StateViewFactory)
export class History {

  constructor(router, navigationHistory, stateViewFactory){
    this._router = router;
    this._navigationHistory = navigationHistory;
    this._stateViewFactory = stateViewFactory;

  }

  get currentRoute(){
    if (this._router.currentRouteItem)
      return this._router.currentRouteItem.route;
    return "";
  }

  @computedFrom('currentRoute')
  get items(){
    var ar = this._navigationHistory.items.slice(0);
    ar.sort(function (a, b) {
      a = new Date(a.dateTime);
      b = new Date(b.dateTime);
      return a>b ? -1 : a<b ? 1 : 0;
    });

    return ar;
  }

  navigate(historyItem){
    this._router.navigate({
      route: historyItem.url,
      title: historyItem.title,
      dashboardName: historyItem.dashboard
    })
  }

  isCurrent(historyItem){
    if (this._router.currentRouteItem)
      return historyItem.url === this._router.currentRouteItem.route;
    return false;
  }


  getStateView(stateItem){
    if (stateItem.value)
      return this._stateViewFactory.createStateView(stateItem.value.stateType, stateItem.value.stateObject);
  }

}
