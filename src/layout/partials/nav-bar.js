import $ from 'jquery';
import {bootstrap} from 'bootstrap';
import {bindable} from 'aurelia-framework';

export class NavBar {
  @bindable router = null;

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
