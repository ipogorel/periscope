import {inject} from 'aurelia-framework';
import {PeriscopeRouter} from './navigator/periscope-router';
import {length, required, date, datetime, email, equality, exclusion, inclusion, format, url, numericality} from 'aurelia-validatejs';
import {ValidationEngine, Validator} from 'aurelia-validatejs';

@inject(PeriscopeRouter)
export class Index {

  errors = [];
  model;
  subscriber;

  constructor(periscopeRouter){
    this._router = periscopeRouter;
    this.model = new LoginModel();
    this.validator = new Validator(this.model)
      .ensure('username')
      .required()
      .email()
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
      this._router.navigate({
        title: "Customers",
        route: "/customers",
        dashboardName: "customers"
      });
    }
  }

  detached() {
    this.subscriber.dispose();
  }
}

class LoginModel {
  username = '';
  password = '';
}
