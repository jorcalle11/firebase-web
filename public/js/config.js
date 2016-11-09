(()=>{
  'use strict'

  const config = {
  apiKey: 'AIzaSyC-LDnwzWiBRRPwZy3cB7J50bu4cf7o9jI',
  authDomain: 'tasks-1e528.firebaseapp.com',
  databaseURL: 'https://tasks-1e528.firebaseio.com',
  storageBucket: 'tasks-1e528.appspot.com',
  messagingSenderId: '1062656345454'
  }

  firebase.initializeApp(config)

  const rootRef     = firebase.database().ref()
  const objectRef   = rootRef.child('object')
  const welcomeName  = document.getElementById('welcomeName')

  objectRef.on('value', snapshot => welcomeName.innerText = snapshot.val().name)
})()