import * as _ from 'lodash';
import {Authentication} from './authentication';
import {inject} from 'aurelia-framework';

const const_usernames = ['hopkins700','privosoft'];

@inject(Authentication)
export class AuthService{
  constructor(authentication){
    this.authentication = authentication;
  }

  login(username, password){
      return new Promise((resolve, reject)=> {
        if (_.indexOf(const_usernames, username)>=0) {
          this.authentication.setUsername(username);
          resolve(username);
        }
        else
          reject({message: "invalid username"});
      });
  }

  logout(redirectUri){
    this.authentication.logout();
  }

  authenticate(provider, redirect, userData){
  }

  signup(displayName, username, password){
  }

  getProfile(){
  }

  isAuthenticated(){
    return this.authentication.isAuthenticated();
  }

  getTokenPayload(){
  }

  unlink(provider){
  }
}
