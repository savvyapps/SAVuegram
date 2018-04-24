import firebase from 'firebase'
import 'firebase/firestore'

// firebase init
const config = {
	apiKey: "AIzaSyCM9MThtyQ5wnN0jT0qft3c6hOdqYgjKMY",
	authDomain: "savuegram.firebaseapp.com",
	databaseURL: "https://savuegram.firebaseio.com",
	projectId: "savuegram",
	storageBucket: "savuegram.appspot.com",
	messagingSenderId: "478655614065"
}
firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {
    timestampsInSnapshots: true
}
db.settings(settings)

// firebase collections
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

export {
    db,
    auth,
    currentUser,
    usersCollection,
    postsCollection,
    commentsCollection,
    likesCollection
}
