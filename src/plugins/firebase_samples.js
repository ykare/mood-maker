import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app';
import 'firebase/firestore';

Vue.use(firestorePlugin)

const firebaseApp = firebase.initializeApp({
    // ここに Firebase の API 情報をコピーする
});

export const db = firebaseApp.firestore();