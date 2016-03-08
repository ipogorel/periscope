import {NavigationHistory} from 'navigator/navigation-history'
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {UserStateStorage} from 'state/user-state-storage';
import {StateDiscriminator} from 'state/state-discriminator';
import {StateUrlParser} from 'state/state-url-parser';
import {StringHelper} from 'helpers/string-helper'
import {UrlHelper} from 'helpers/url-helper'
import {Router} from 'aurelia-router';
import lodash from 'lodash';


@inject(Router, EventAggregator, UserStateStorage, NavigationHistory, StateUrlParser)
export class PeriscopeRouter {
  constructor(aureliaRouter, eventAggregator, userStateStorage, navigationHistory){
    this._aureliaRouter = aureliaRouter;
    this._navigationHistory = navigationHistory;
    this._userStateStorage = userStateStorage;
    this._eventAggregator = eventAggregator;

  }

  get currentRouteItem() {
    return this._currentRoute;
  }
  set currentRouteItem(value) {
    this._currentRoute = value;
  }

  navigate(routeItem){
    // update the history with the current state
    if (this.currentRouteItem){
      var currentWidgetsState = StateDiscriminator.discriminate(this._userStateStorage.getAll(this.currentRouteItem.dashboardName));
      var url = "/" + this.currentRouteItem.dashboardName + StateUrlParser.stateToQuery(currentWidgetsState);
      if (_.filter(this._navigationHistory.items,i=>StringHelper.compare(i.url, url)).length===0){
        this._navigationHistory.add(url, this.currentRouteItem.title, this.currentRouteItem.dashboardName, currentWidgetsState, new Date());
      }
      else if (!StringHelper.compare(url,this.currentRouteItem.route)) { // state change but there already a route with the same state
        this._navigationHistory.update(url,new Date());
      }
    }

    // synchronize a stored state and a state from the route
    var routeWidgetsState = StateUrlParser.queryToState(routeItem.route);
    var storageWidgetsState = StateDiscriminator.discriminate(this._userStateStorage.getAll(routeItem.dashboardName));
    for (let oldSt of storageWidgetsState)
      this._userStateStorage.remove(oldSt.key);
    for (let newSt of routeWidgetsState)
      this._userStateStorage.set(newSt.key,newSt.value);

    // add the new route to the history
    if (_.filter(this._navigationHistory.items,i=>StringHelper.compare(i.url, routeItem.route)).length===0){ // add new history item
      this._navigationHistory.add(routeItem.route, routeItem.title, routeItem.dashboardName, this._userStateStorage.getAll(routeItem.dashboardName), new Date());
    }
    // navigate to the new route
    this.currentRouteItem = routeItem;
    this._aureliaRouter.navigate(routeItem.route);
  }


}
