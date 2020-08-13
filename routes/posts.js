var express = require("express");
var router = express.Router();
var Post = require("../models/post");
var middleware = require("../middleware");

// index of posts
router.get("/", function(req, res){
    Post.find({}, function(err, posts){
        if(err){
            console.log(err);
        } else {
             res.render("blog/index", {posts: posts, page: "posts"});
        }
    });
   
});

// create post
//CREATE - add new post to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to posts array
  var name = req.body.name;
  var entry = req.body.entry;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
    var newPost = {name: name, entry: entry, image: image, description: desc, author:author};
    // Create a new post and save to DB
    Post.create(newPost, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to posts page
            console.log(newlyCreated);
            req.flash("success", "Success! A new blog entry has been created!");
            res.redirect("/blog");
        }
    });
  });

// new post
router.get("/new", middleware.isUserAdmin, function(req, res){
   res.render("blog/new");
});

// show post
router.get("/:id", function(req, res){
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err || !foundPost){
            console.log(err);
            req.flash("error", "Sorry, that particular entry does not exist!");
            res.redirect("/blog");
        } else {
            console.log(foundPost);
             res.render("blog/show", {post: foundPost});
        }
    });
   
});

// edit post route
router.get("/:id/edit", middleware.checkPostOwnership, function(req, res){
        Post.findById(req.params.id, function(err, foundPost){
            if(err || !foundPost){
                req.flash("error", "Apologies, that entry was not found!");
                res.redirect("back");
            } else {
                res.render("blog/edit", {post: foundPost});
            }
        });
});


// update post route
router.put("/:id", middleware.checkPostOwnership, function(req, res){

    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, post){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","This entry has been successfully updated!");
            res.redirect("/blog/" + post._id);
        }
    });
  });

// destroy post route
router.delete("/:id", middleware.checkPostOwnership, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Hmmm, something went wrong. That entry was not deleted.");
            res.redirect("/blog");
        } else {
            req.flash("success", "BOOM! Success! Entry successfully deleted!");
            res.redirect("/blog");
        }
    });
});

module.exports = router;