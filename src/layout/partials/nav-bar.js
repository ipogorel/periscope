import $ from 'jquery';
import bootstrap from 'bootstrap';
import {Authentication} from './../../auth/authentication';
import {inject, bindable} from 'aurelia-framework';

@inject(Authentication)
export class NavBar {
  @bindable router = null;

  constructor(authentication){
    this.authentication = authentication;
  }

  get showExpander(){
    return this.authentication.isAuthenticated();
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
