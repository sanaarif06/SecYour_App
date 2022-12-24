import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseuiAngularLibraryService, FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FireAuthService {

  constructor(private firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService, public afAuth: AngularFireAuth, public userDetail: User) {
    firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
  }
    public UserDetail = new User();
  public successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    localStorage.setItem('user', JSON.stringify(signInSuccessData.authResult.user));
  }

  public errorCallback(errorData: FirebaseUISignInFailure) {
    this.userDetail.GetUserDetails();
  }

  public uiShownCallback() {
    ;
  }

  public SignOut() {
    if (this.userDetail.IsLoggedIn) {
      return this.afAuth.signOut().then(() => {
        localStorage.removeItem('user');
        window.alert('Logged out!');
      });
    }
    else return null;
  }
}
