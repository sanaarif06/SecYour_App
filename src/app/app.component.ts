import { Component } from '@angular/core';
import { User } from './models/user.model';
import { FireAuthService } from './fire-auth.service';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SecYour';
  userDetail = new User();
  PhoneNumber = '';
  constructor(public fireAuth: FireAuthService) {
  }

  ngOnInit() {
    this.userDetail = this.fireAuth.UserDetail;

  }
  ngAfterViewInit() {
    this.PhoneNumber = this.fireAuth.getPhoneNumber();
    const input = document.getElementById('txtPhone') as HTMLInputElement;
    if(this.PhoneNumber != '' && this.PhoneNumber != null)
    input.hidden;
    if (input)
      input.innerText = this.PhoneNumber;
  }
  SignInSuccess(event: FirebaseUISignInSuccessWithAuthResult) {
    this.fireAuth.successCallback(event);
    this.userDetail = this.fireAuth.UserDetail;
    location.reload();
  }

  SignInError(event: FirebaseUISignInFailure) {
    this.fireAuth.errorCallback(event);
  }

  SignInuiShown() {
    this.fireAuth.uiShownCallback();
  }

  SignOut() {
    this.fireAuth.SignOut();
    this.userDetail = this.fireAuth.UserDetail;
    location.reload();

  }

  addPhone() {
    const input = document.getElementById('txtPhone') as HTMLInputElement;
    if (this.PhoneNumber == null || this.PhoneNumber == '') {
      const value = input?.value;

      if (this.fireAuth.savePhoneNumber(value))
        console.log("Phone number added!");
      else
        console.log("Error while adding phone number!");
    }
    this.fireAuth._verifyPhoneNumber(this.PhoneNumber);

  }


}
