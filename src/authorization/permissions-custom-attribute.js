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
    let widgetName = "";
    let permissions = []
    if (_.isString(this.value)) {
      widgetName = this.element.au.permissions.scope.bindingContext.name; // get widget name
      permissions = this.value.split(",");
    }
    else if (_.isPlainObject(this.value)){
      widgetName = this.value.widgetName;
      permissions = this.value.permissions;
    }
    for (let p of permissions){
      if (!this.permissionsManager.hasPermisson(p, widgetName)) {
        this.element.hidden = true;
        return;
      }
    }
    this.element.hidden = false;
  }
}
