/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

function getFacts() {
    const ref = firebaseApp.database().ref('facts');
    return ref.once('value').then(snap => snap.val());
}

const app = express();
app.engine('pug', engines.pug);
app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    // eslint-disable-next-line promise/always-return
    // eslint-disable-next-line promise/catch-or-return
    getFacts().then(facts => {
        res.render('index', { facts });
    });
})

exports.app = functions.https.onRequest(app);
