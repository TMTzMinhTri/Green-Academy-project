const express = require('express')
const fb = require('firebase');

const config = {
  test: {
    apiKey: "AIzaSyDUmBiyuJgOUzYvghXjkn_8MBKwFRMzV4U",
  	authDomain: "nails-test.firebaseapp.com",
  	databaseURL: "https://nails-test.firebaseio.com",
  	projectId: "nails-test",
  	storageBucket: "nails-test.appspot.com",
  	messagingSenderId: "62775543575"
  }
};

const extensionEmail = '@nails.com'

const fireBaseClient = fb.initializeApp(config.test);

var FireBase = {
  login: function(phone_number, password) {
    const email = `${phone_number}${extensionEmail}`
    console.log(email, password)
    return fireBaseClient.auth().signInWithEmailAndPassword(email, password)
  },
  logout: function() {
    return fireBaseClient.auth().signOut();
  },
  logged: function() {
    return fireBaseClient.auth().currentUser
  },
  createNewUser : (phone_number, password) => {
    const email = `${phone_number}${extensionEmail}`
    return fireBaseClient.auth().createUserWithEmailAndPassword(email, password)
  },
  connectFirebaseDatabaseRegister: (phone_number) => {
    let phone = phone_number.replace(/^\+/, '');
    return fireBaseClient.database().ref(`nails/register/${phone}`);
  },
  connectDatabaseCreateUser : (uid) => {
    return fireBaseClient.database().ref(`nails/users/${uid}`)
  },
  connectDatabaseSignUp :() => {
    return fireBaseClient.database().ref('nails/user')
  },
  getDataInfireStore : () => {
    return fireBaseClient.storage().ref().root.getDownloadURL()
  }
}
module.exports = FireBase;

  //  const self = this;
  //   fireBase.auth().signOut();
  //   fireBase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       console.log(user);
  //     } else {
  //       self.setState({
  //         redirect: true
  //       })
  //     }
  //   })