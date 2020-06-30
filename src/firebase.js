import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init
const firebaseConfig = {
  apiKey: 'AIzaSyCM9MThtyQ5wnN0jT0qft3c6hOdqYgjKMY',
  authDomain: 'savuegram.firebaseapp.com',
  databaseURL: 'https://savuegram.firebaseio.com',
  projectId: 'savuegram',
  storageBucket: 'savuegram.appspot.com',
  messagingSenderId: '478655614065',
  appId: '1:478655614065:web:66b1c51f599bd76f015fd0'
}
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection
}
