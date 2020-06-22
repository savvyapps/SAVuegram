import Vue from "vue";
import Vuex from "vuex";
const fb = require('../firebaseConfig.js')

Vue.use(Vuex);

fb.auth.onAuthStateChanged(user => {
  if(user) {
    store.commit('setCurrentUser', user)
    store.dispatch('fetchUserProfile')

    fb.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit('setUserProfile', doc.data())
    })
    
    //check if created by currentUser
    fb.postsCollection.orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
      let createdByCurrentUser
      let docChangesArry = querySnapshot.docChanges()
      if(querySnapshot.docs.length) {
        let id = store.state.currentUser.uid
        let docId = docChangesArry[0].doc.data().userId
        createdByCurrentUser = id == docId ? true : false
      }
      
      //add new posts to hiddenPosts array after initial load
      if(docChangesArry.length !== querySnapshot.docs.length
         && docChangesArry[0].type == 'added' 
         && !createdByCurrentUser){
          
        let post = docChangesArry[0].doc.data()
        post.id = docChangesArry[0].doc.id    
        store.commit('setHiddenPosts', post)
      } else {
        let postsArray = []

        querySnapshot.forEach(doc => {
          let post = doc.data()
          post.id = doc.id
          postsArray.push(post)
        })
        store.commit('setPosts', postsArray)
      }
    })
  
  }
})

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    posts: [],
    hiddenPosts: []
  },
  mutations: {
    setCurrentUser(state, val){
      state.currentUser = val
    },
    setUserProfile(state, val){
      state.userProfile = val
    },
    setPosts(state, val) {
      if(val) {
        state.posts = val
      } else {
        state.posts = []
      }
    },
    setHiddenPosts(state, val) {
      if(val) {
        if(!state.hiddenPosts.some(x => x.id === val.id)) {
          state.hiddenPosts.unshift(val)
        }
      } else {
        state.hiddenPosts = []
      }
    }
  },
  actions: {
    clearData({ commit }) {
      commit('setCurrentUser', null)
      commit('setUserProfile', {})
      commit('setPosts', null),
      commit('setHiddenPosts', null)
    },
    fetchUserProfile({ commit, state }){
      fb.usersCollection.doc(state.currentUser.uid).get().then(res => {
        commit('setUserProfile', res.data())
      }).catch(err => {
        console.log(err)
      })
    },
    updateProfile({ state }, data) {
      let name = data.name
      let title = data.title

      fb.usersCollection.doc(state.currentUser.uid).update({ name, title }).then(user => {
        console.log(user, "update user .then()")
        
        fb.postsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
          console.log("post get .then()")
          docs.forEach(doc => {
            fb.postsCollection.doc(doc.id).update({
              userName: name
            })
          })
        })

        fb.commentsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
          console.log("comments get .then()")
          docs.forEach(doc => {
            fb.commentsCollection.doc(doc.id).update({
              userName: name
            })
          })
        })
      }).catch(err => {
        console.log(err)
      })
    }
  },
  modules: {}
});
