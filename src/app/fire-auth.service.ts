import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { FirebaseuiAngularLibraryService, FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { User } from './models/user.model';
import { firebase } from 'firebaseui-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireAuthService {


  constructor(private firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService, public afAuth: AngularFireAuth,
    public userDetail: User, private db: AngularFireDatabase) {
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

  private basePath = '/phoneNumbers/' + this.userDetail.UserID + '/';

  savePhoneNumber(PhoneNumber: String) {
    try {
      this.db.object<String>(this.basePath).set(PhoneNumber);
    return true;
    }
    catch{ return false;}
  }
  
  getPhoneNumber(){
    
    this.db.object<string>(this.basePath).valueChanges().subscribe(string => {
      console.log(string);
      this.userDetail.PhoneNumber = string ? string : '';
    });
    return this.userDetail.PhoneNumber;
  }

  async _verifyPhoneNumber(phoneNumber: string): Promise<void> {
    const user = this.afAuth.currentUser;
    console.log("service called!");
    if (user) {
      try {
        const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
          callback: (response: any) => console.log('callback', response),
          size: 'invisible',
        });
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        const verificationId = await phoneProvider.verifyPhoneNumber(this.getPhoneNumber(), verifier);
        var verificationCode = window.prompt("Enter sms code", "");
        const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode ? verificationCode : "000123");
        await user.then(u => console.log(u));
        console.log('Phone number updated successfully');
      } catch (error) {
        console.error(error);
      }
    }
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
