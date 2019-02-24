import app from 'firebase/app';
import 'firebase/auth';

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

        app.initializeApp(config);

        this.auth = app.auth();
      
        this.googleProvider = new app.auth.GoogleAuthProvider(); 
    }


     // *** Auth API ***
    doCreateUserWithEmailAndPassword = (email, password) =>
      this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
      this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>  this.auth.currentUser.updatePassword(password);
    
    doSignInWithGoogle = () =>   this.auth.signInWithPopup(this.googleProvider);

    

   
}



export default Firebase;







