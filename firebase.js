//https://stackoverflow.com/questions/66879378/typeerror-undefined-is-not-an-object-evaluating-app-firestore
//https://blog.logrocket.com/integrating-firebase-authentication-expo-mobile-app/
// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
//import 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
//import 'firebase/compat/firestore';
import Constants from 'expo-constants';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: Constants.manifest?.extra?.firebaseApiKey,
	authDomain: Constants.manifest?.extra?.firebaseAuthDomain,
	projectId: Constants.manifest?.extra?.firebaseProjectId,
	storageBucket: Constants.manifest?.extra?.firebaseStorageBucket,
	messagingSenderId: Constants.manifest?.extra?.firebaseMessagingSenderId,
	appId: Constants.manifest?.extra?.firebaseAppId,
	databaseURL: Constants.manifest?.extra?.firebaseDatabaseURL,
	measurementId: Constants.manifest?.extra?.firebaseMeasurementId
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
let app;

if (firebase.apps.length === 0) {
	app = firebase.initializeApp(firebaseConfig)
} else {
	app = firebase.app();
}

export default app;