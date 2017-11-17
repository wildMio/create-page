// Initialize Firebase
var config = {
  apiKey: "AIzaSyAkzgGZOzFsIZgMoKFEzxQllrSlb9XD6XY",
  authDomain: "goalcoach-9a62a.firebaseapp.com",
  databaseURL: "https://goalcoach-9a62a.firebaseio.com",
  projectId: "goalcoach-9a62a",
  storageBucket: "goalcoach-9a62a.appspot.com",
  messagingSenderId: "721917969689"
};
const firebaseApp = firebase.initializeApp(config);
const advisedRef = firebase.database().ref('advised');