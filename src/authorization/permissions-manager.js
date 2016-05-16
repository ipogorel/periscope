import * as _ from 'lodash';
import {PermissionsManagerConfiguration} from './permissions-manager-configuration';

export class PermissionsManager {
  constructor(){
    this._permissionsMatrix = [];
  }


  configure(config){
    let normalizedConfig = new PermissionsManagerConfiguration();
    config(normalizedConfig);
    this._permissionsMatrix = normalizedConfig.permissionsMatrix;
    this._authentication = normalizedConfig.authentication;
  }

  hasPermisson(permission, resourceName){
    let w = _.find(this._permissionsMatrix,{'resource':resourceName, 'role': this._authentication.getRole()});
    if (!w) // permissions for this widget and role are not stated
      return false;
    else
      return _.indexOf(w.permissions,permission)>=0;
  }
}

/*
[
  {
    widget: "widgetName1",
    role: "roleName1",
    permissions:["r","w"]
  },
  {
   widget: "widgetName1",
   role: "roleName2",
   permissions:["r"]
  }
]
*/
