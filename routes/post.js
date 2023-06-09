const express = require('express')
const requireLogin = require('../middleware/requireLogin')
const router = express.Router()
const Post = require('../models/post')

router.post('/createpost', requireLogin, (req, res) => {
    const { title, body, pic } = req.body
    console.log(pic);
    if (!title || !body || !pic) {
        return res.status(401).json({ error: "Please fill all the fields" })
    } else {
        req.user.password = undefined
        const post = new Post({
            title, body, photo: pic, postedBy: req.user
        })
        console.log(req.user);
        post.save().then((result) => {
            return res.status(200).json({ post: result, message: "Created post successfully" })
        }).catch(err => console.log(err))

    }
})

router.get('/allpost', requireLogin, (req, res) => {
    Post.find().populate("postedBy", "_id name").then((posts) => {
        res.json({ posts })
    }).catch(err => console.log(err))
})
router.get('/getsubpost', requireLogin, (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } }).populate("postedBy", "_id name").then((posts) => {
        res.json({ posts })
    }).catch(err => console.log(err))
})
router.get('/mypost', requireLogin, (req, res) => {
    // console.log(req.user);
    Post.find({ postedBy: req.user._id }).populate("postedBy", "_id name").then((mypost) => {
        res.json({ mypost })
    }).catch(err => console.log(err))
})
router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})
router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})
router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    }).populate("comments.postedBy", "_id name").
        populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})
router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        res.json(result)
                    }).catch(err => {
                        console.log(err);
                    })
            }
        })

})
module.exports = router