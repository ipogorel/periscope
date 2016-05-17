import {inject} from 'aurelia-dependency-injection';
import {Redirect} from 'aurelia-router';
import {Authentication} from './authentication';

@inject(Authentication)
export class AuthorizeStep {
  constructor(auth) {
    this.auth = auth;
  }
  run(routingContext, next) {
    let isLoggedIn = this.auth.isAuthenticated();
    let loginRoute = this.auth.getLoginRoute();

    if (!routingContext.getAllInstructions().some(i => i.fragment === loginRoute)){
      if (!isLoggedIn)
        return next.cancel(new Redirect(loginRoute));
    }
    return next();
  }
}
