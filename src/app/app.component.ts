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

  constructor(public fireAuth: FireAuthService){
  }

  ngOnInit(){
    this.userDetail = this.fireAuth.UserDetail;
  }

  SignInSuccess(event: FirebaseUISignInSuccessWithAuthResult){
    this.fireAuth.successCallback(event);
    this.userDetail = this.fireAuth.UserDetail;
    location.reload();
  }

  SignInError(event: FirebaseUISignInFailure){
    this.fireAuth.errorCallback(event);
  }

  SignInuiShown(){
    this.fireAuth.uiShownCallback();
  }  

  SignOut(){
    this.fireAuth.SignOut();
    this.userDetail = this.fireAuth.UserDetail;
    location.reload();
  
  }
  

}
