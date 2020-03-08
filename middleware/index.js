var Post = require("../models/post");
var Comment = require("../models/comment");
var User = require("../models/user");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkPostOwnership = function(req, res, next){
   if(req.isAuthenticated()){
        Post.findById(req.params.id, function(err, foundPost){
        if(err || !foundPost){
            console.log(err);
            req.flash("error", "Sorry, we're not able to locate that post. Please try again.");
            res.redirect("back");
        } else {
            //does user own the post?
            if(foundPost.author.id.equals(req.user._id) || req.user.isAdmin){
                req.post = foundPost;
                next();
            } else {
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        }
    });
    } else {
       req.flash("error", "You need to be logged in to perform that action.");
       res.redirect("back");
    } 
};

middlewareObj.checkCommentOwnership = function(req, res, next){
   if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err || !foundComment){
            console.log(err);
            req.flash("error", "Comment not found!");
            res.redirect("back");
        } else {
            //does user own the comment?
            if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                req.comment = foundComment;
                next();
            } else {
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    } 
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};


module.exports = middlewareObj;