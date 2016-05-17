import $ from 'jquery';
import bootstrap from 'bootstrap';
import {PeriscopeRouter} from './../../navigator/periscope-router';
import {Authentication} from './../../auth/authentication';
import {inject, bindable} from 'aurelia-framework';

@inject(Authentication, PeriscopeRouter)
export class NavBar {
  @bindable router = null;

  constructor(authentication, periscopeRouter){
    this.authentication = authentication;
    this.periscopeRouter = periscopeRouter;
  }

  get showExpander(){
    return this.authentication.isAuthenticated();
  }

  logout(){
    this.authentication.logout();
    //this.periscopeRouter.navigate("/");
  }

  attached() {
    $('#nav-expander').on('click',function(e){
      e.preventDefault();
      $('body').toggleClass('nav-expanded');
    });
    $('#nav-close').on('click',function(e){
      e.preventDefault();
      $('body').removeClass('nav-expanded');
    });
    $('#collapseDashboards').collapse('show');
  }
}
