var mongoose = require("mongoose");

// schema setup
var postSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    location: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
        username: String
        },
    comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
});

module.exports = mongoose.model("Post", postSchema);