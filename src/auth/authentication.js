import * as _ from 'lodash';

const login_url = "/";
const const_userroles = [{
    username: 'hopkins700',
    roles: ['member']
  }, {
    username: 'privosoft',
    roles: ['admin']
  }
];

export class Authentication {
  constructor(){
    this.storage = sessionStorage;
    this.username = "stub_auth_username";
  }
  
  getUsername() {
    return this.storage.getItem(this.username);
  }
  setUsername(username) {
    this.storage.setItem(this.username, username);
  }

  logout(){
    this.storage.remove(this.username);
  }

  isAuthenticated() {
    if (this.storage.getItem(this.username))
      return true;
    return false;
  }

  getRoles(){
    if (!this.isAuthenticated())
      return [];
    return _.find(const_userroles,{"username": this.getUsername()}).roles;
  }

  getLoginRoute(){
    return login_url;
  }
}
