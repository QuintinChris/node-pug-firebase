/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');

const postController = require('./controllers/postController');
const friendController = require('./controllers/friendController');
const commentController = require('./controllers/commentController');
const userController = require('./controllers/userController');


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


// SETTING ROUTES

app.get('/', (req, res) => {
    res.render('index');
    /*
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    // eslint-disable-next-line promise/always-return
    // eslint-disable-next-line promise/catch-or-return
    getFacts().then(facts => {
        res.render('index', { facts });
    });
    */
});

// USER ROUTES
// GET  all users
app.get("/users/", userController.allUsers);

// GET user profile
app.get("/users/profile", userController.userProfile);

// GET users timeline
//app.get("/timeline", userController.userTimeline);

// GET users friend list
app.get("/users/:id/friends", userController.userFriends);

// GET logged in users friend requests
app.get("/users/friend-requests", userController.userFriendRequests);

// FRIEND ROUTES
// POST for create friendship
app.post("/users/friends/:id/new", friendController.friendshipCreate);

// POST to accept friend request
app.post("/users/friends/:id/accept", friendController.friendshipEdit);



// POST ROUTES
// POST for creating post
app.post("/posts/new", postController.postCreate);

// POST for liking post
app.post("/posts/:id/like", postController.postLike);


// COMMENT ROUTES
// POST to create comment
app.post("/posts/:id/comments/new", commentController.commentCreate);

// PUT to edit comment
app.put("/posts/:id/comments/:commentid/edit", commentController.commentEdit);

// POST to like comment
app.post("/posts/:id/comments/:commentid/like", commentController.commentLike);


// GET login
app.get("/login", (req, res) => res.render("login", { user: req.user }));
// END ROUTES


exports.app = functions.https.onRequest(app);
