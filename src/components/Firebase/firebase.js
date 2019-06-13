import app from 'firebase/app';
import 'firebase/auth';

//setup config data
var config = {
		apiKey: "AIzaSyCnDIbI8tiFRvchuoXHV07PIce3enlWu60",
		authDomain: "combatdatabase-c474n.firebaseapp.com",
		databaseURL: "https://combatdatabase-c474n.firebaseio.com",
		projectId: "combatdatabase-c474n",
	    storageBucket: "combatdatabase-c474n.appspot.com",
		messagingSenderId: "566494010270"
};


class Firebase {

    constructor(){

        //initialize app
        app.initializeApp(config);

        //set auth
        this.auth = app.auth();
        
        //get google auth provide
        this.googleProvider = new app.auth.GoogleAuthProvider(); 
    }


    // set authorisation / authentication functions
    doCreateUserWithEmailAndPassword = (email, password) =>
      this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
      this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>  this.auth.currentUser.updatePassword(password);
    
    doSignInWithGoogle = () =>   this.auth.signInWithPopup(this.googleProvider);

    doDeleteAccount = () => this.auth.currentUser.delete(); 

    
    
    doGetGoogleCredentials = token => this.googleProvider.credential(null,token);

    doGetPasswordCredentials = (email,password) => this.auth.EmailAuthProvider.credential(email,password);

    doReauthenticatePassword = credentials => this.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credentials);

    doReauthenticateGoogle = credentials => this.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credentials);
        
    doDeleteUser = () =>  this.auth.currentUser.delete();
   


    
}



export default Firebase;







