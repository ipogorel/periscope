import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {length, required, date, datetime, email, equality, exclusion, inclusion, format, url, numericality} from 'aurelia-validatejs';
import {ValidationEngine, Validator} from 'aurelia-validatejs';
//import {AuthService} from 'aurelia-auth';
import {AuthService} from './auth/auth-service';

@inject(Router, AuthService)
export class Index {

  errors = [];
  model;
  subscriber;

  constructor(router, authService){
    this._router = router;
    this._authService = authService;
    this.model = new LoginModel();
    this.validator = new Validator(this.model)
      .ensure('username')
      .required()
      .ensure('password')
      .required();
    this.reporter = ValidationEngine.getValidationReporter(this.model);
    this.subscriber = this.reporter.subscribe(result => {
      this.renderErrors(result);
    });
  }

  hasErrors() {
    return !!this.errors.length;
  }

  renderErrors(result) {
    this.errors.splice(0, this.errors.length);
    result.forEach(error => {
      this.errors.push(error)
    });
  }

  submit() {
    this.validator.validate();
    if (!this.hasErrors()) {
      this._authService.login(this.model.username, this.model.password).then(response=>{
        this._router.navigate("/customers");
      }, error => {
        this.renderErrors([error]);
      })
    }
  }
  authenticate(name){
    return this._authService.authenticate(name, false, null)
      .then((response)=>{
        console.log("auth response " + response);
      });
  }

  detached() {
    this.subscriber.dispose();
  }
}

class LoginModel {
  username = '';
  password = '';
}
