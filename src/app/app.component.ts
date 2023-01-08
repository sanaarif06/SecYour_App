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
  Message = '';
  addPhone(e:Event) {
    // const btn = document.getElementById('btnAddPhone') as HTMLButtonElement;
    // btn.disabled = true;
    // const input = document.getElementById('txtPhone') as HTMLInputElement;
    // if (this.PhoneNumber == null || this.PhoneNumber == '') {
    //   const value = input?.value;

    //   if (this.fireAuth.savePhoneNumber(value))
    //     this.Message = 'Phone Number Added! Sending Auth Code';
    //   else
    //     this.Message = "Error while adding phone number!";
    // }
    (e.target as HTMLButtonElement).disabled = true;;
    this.fireAuth._verifyPhoneNumber().then(
      res => {
        if (res) {
          const vault = document.getElementById('Vault') as HTMLDivElement;
          vault.hidden = false;
          const Phone = document.getElementById('DivPhone') as HTMLDivElement;
          Phone.hidden = true;
        }
        else{
          window.alert('Incorrect code entered! Please refresh the page for another attempt. Too many wrong attempts might cause a permanent block.');
          // btn.disabled = false;
        }
      }
    );

  }


}
