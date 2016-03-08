import {inject, bindable, computedFrom} from 'aurelia-framework';
import {PeriscopeRouter} from 'navigator/periscope-router';

@inject(PeriscopeRouter)
export class DashboardsList {
  constructor(periscopeRouter){
    this._periscopeRouter = periscopeRouter;
  }

  navigate(dashboard){
    this._periscopeRouter.navigate({
        route: dashboard.url,
        title: dashboard.title,
        dashboardName: dashboard.name
      }
    );
  }
}
