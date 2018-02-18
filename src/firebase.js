const firebase = require('firebase')

const config = {
  apiKey: "AIzaSyDzyLI6X7lz0oGtys_FWoh_tucQP1jSGdA",
  authDomain: "photo-load.firebaseapp.com",
  databaseURL: "https://photo-load.firebaseio.com",
  projectId: "photo-load",
  storageBucket: "photo-load.appspot.com",
  messagingSenderId: "119279445969"
};
firebase.initializeApp(config)

const provider = new firebase.auth.GoogleAuthProvider()
const auth = firebase.auth()
const storage = firebase.storage()

module.exports = {
  firebase,
  provider,
  auth,
  storage
}
