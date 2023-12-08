// Create web server

// Import modules
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const User = require('../models/User');
const Post = require('../models/Post');
const { ensureAuthenticated } = require('../config/auth');

// GET request for comments
router.get('/', ensureAuthenticated, (req, res) => {
    Comment.find({}).sort({date: -1}).then(comments => {
        res.render('comments/index', {comments: comments});
    }).catch(err => {
        console.log(err);
    });
});

// POST request for comments
router.post('/', ensureAuthenticated, (req, res) => {
    Comment.create({
        comment: req.body.comment,
        user: req.user._id,
        post: req.body.post
    }).then(comment => {
        Post.findById(req.body.post).then(post => {
            post.comments.push(comment);
            post.save().then(post => {
                res.redirect('/posts/' + req.body.post);
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
});

// GET request for new comment
router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('comments/new');
});

// GET request for edit comment
router.get('/:id/edit', ensureAuthenticated, (req, res) => {
    Comment.findById(req.params.id).then(comment => {
        if (comment.user != req.user._id) {
            res.redirect('/comments');
        } else {
            res.render('comments/edit', {comment: comment});
        }
    }).catch(err => {
        console.log(err);
    });
});

// PUT request for comment
router.put('/:id', ensureAuthenticated, (req, res) => {
    Comment.findByIdAndUpdate(req.params.id, {
        comment: req.body.comment
    }).then(comment => {
        res.redirect('/comments');
    }).catch(err => {
        console.log(err);
    });
});

// DELETE request for comment
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Comment.findByIdAndRemove(req.params.id).then(comment => {
        res.redirect('/comments');
    }).catch(err => {
        console.log(err);
    });
});

module.exports = router;