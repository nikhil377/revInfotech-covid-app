import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'

const config = {
    apiKey: "AIzaSyCgUEWd0tywLJUbVcc1MLwGPoSq6kDc2_E",
    authDomain: "covid-19-d3f11.firebaseapp.com",
    databaseURL: "https://covid-19-d3f11.firebaseio.com",
    projectId: "covid-19-d3f11",
    storageBucket: "covid-19-d3f11.appspot.com",
    messagingSenderId: "876575555957",
    appId: "1:876575555957:web:1cb738dce2726ec5f3533c",
    measurementId: "G-2QM61KHYT2"
  };
  // Initialize Firebase
//   app.initializeApp(firebaseConfig);

class Firebase {
	constructor() {
		app.initializeApp(config)
		this.auth = app.auth()
		this.db = app.firestore()
	}

	login(email, password) {
		return this.auth.signInWithEmailAndPassword(email, password)
	}

	logout() {
		return this.auth.signOut()
	}

	async register(name, email, password) {
		await this.auth.createUserWithEmailAndPassword(email, password)
		return this.auth.currentUser.updateProfile({
			displayName: name
		})
	}


	isInitialized() {
		return new Promise(resolve => {
			this.auth.onAuthStateChanged(resolve)
		})
	}

	getCurrentUsername() {
		return this.auth.currentUser && this.auth.currentUser.displayName
	}
}

export default new Firebase()