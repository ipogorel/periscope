import {inject} from 'aurelia-framework';
import {DefaultDashboardConfiguration} from './config/default-dashboard-configuration';
import {UserStateStorage} from './state/user-state-storage';
import {AuthorizeStep} from './auth/authorize-step';
import {HistoryStep} from './navigator/history-step';
import $ from 'jquery';

@inject(DefaultDashboardConfiguration, UserStateStorage)
export class App {
  constructor(dashboardsConfiguration, userStateStorage) {
    dashboardsConfiguration.invoke();
    userStateStorage.clearAll();
  }


  configureRouter(config, router){
    config.title = 'Periscope';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.addPipelineStep('authorize', HistoryStep);
    config.map([
      { route: '',  name: 'login',  moduleId: './index',  nav: true, title:'Login' },
      { route: ['/#/', '/:dashboard'],  name: 'dashboard',  moduleId: './dashboard',  nav: true, title:'Dashboard' }
    ]);
    this.router = router;
  }


  
  attached(){
    var elementsHeight = $(".navbar")[0].scrollHeight + $(".mainnav")[0].scrollHeight-8;
    if ($(".breadcrumb")[0])
      elementsHeight+=$("breadcrumb")[0].scrollHeight;
    $(".content").css("height",$("#wrapper")[0].clientHeight-elementsHeight);
  }
}
