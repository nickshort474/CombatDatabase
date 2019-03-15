import {firebase} from '@firebase/app';

export const _getUsername = (uid) => {

	let firestore = firebase.firestore();
	let ref = firestore.collection("Users").doc(uid);
	ref.get().then((snapshot)=>{
		console.log(snapshot.data().userName);
		return snapshot.data().userName
	})
}

/*exports._getUsername = _getUsername;*/