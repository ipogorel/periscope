import {inject, bindable} from 'aurelia-framework';
import * as _ from 'lodash';
import {PermissionsManager} from './permissions-manager';

@inject(Element, PermissionsManager)
export class PermissionsCustomAttribute {

  constructor(element, permissionsManager){
    this.element = element;
    this.permissionsManager = permissionsManager;
  }

  bind() {
    if (!this.value)
      return;
    let widgetName = this.element.au.permissions.scope.bindingContext.name;
    let permissions = this.value;
    if (!_.isArray(permissions))
      permissions = this.value.split(",");
    for (let p of permissions){
      if (!this.permissionsManager.hasPermisson(p, widgetName)) {
        this.element.hidden = true;
        return;
      }
    }
    this.element.hidden = false;
  }
}
