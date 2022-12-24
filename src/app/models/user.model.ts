export class User {
    UserID!: string;
    DisplayName!: string;
    PhotoURL!: string;
    Email!: string;
    PhoneNumber!: string;
    IsLoggedIn!: boolean;

    constructor() {
        this.GetUserDetails();
    }

    GetUserDetails() {
        if (localStorage.getItem('user') != null) {
            var _UserDetails = JSON.parse(localStorage.getItem('user')!)
            this.Email = _UserDetails.email;
            this.PhoneNumber = _UserDetails.phoneNumber;
            this.PhotoURL = _UserDetails.photoURL;
            this.UserID = _UserDetails.uid;
            this.DisplayName = _UserDetails.displayName;
            this.IsLoggedIn = true;
        }
        else {
            this.Email = '';
            this.PhoneNumber = ''
            this.PhotoURL = '';
            this.UserID = '';
            this.DisplayName = '';
            this.IsLoggedIn = false;
        }
        return User;
    }
}