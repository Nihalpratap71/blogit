const express = require("express")
const app = express();
const bodyParser = require("body-parser");

const mongoose = require("mongoose");


// middlewares

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))


mongoose.connect("mongodb://localhost:27017/testBlogDB")

// make schema blog
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true,
    },
    content: {
        type: String,
        require: true,
        unique: true,
    }
});
const Blog = new mongoose.model("blog", blogSchema);

// signup schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:[true,"should be in lowercase only"]
    },
    password: {
        type: String,
        required: true,
        unique: true,
        minlength:10
    }
});
const User = new mongoose.model("user", userSchema);




app.route("/")
    .get((req, res) => {
        res.render("home")
    });
app.route("/about")
    .get((req, res) => {
        res.render("about")
    })

app.route("/login")
    .get((req, res) => {
        res.render("login")
    })
app.post("/login", (req, res) => {
    console.log(req.body.email);
    console.log(req.body.passward);
    console.log(req.body.age)
    res.redirect("/")
})
app.route("/signup")
    .get((req, res) => {
        res.render("signup")
    })

    .post((req, res) => {

        var user = new User({
            email: req.body.email,
            password: req.body.password
        });
        user.save((err) => {
            if (!err) {
                console.log("item save successfully")
            }
        })
        res.redirect("/blog")

    })
app.route("/blogs")
    .get((req, res) => {
        Blog.find({}, (err, result) => {
            if (!err) {
                res.render("blogs", {
                    result: result
                });
            } else {
                console.log(err);
            }
        });
    });

app.route("/blog")
    .get((req, res) => {
       User.find({})
    })

    .post((req, res) => {
        var blog = new Blog({
            title: req.body.title,
            content: req.body.content
        });
        blog.save((err) => {
            if (!err) {
                console.log("item saved successfully")

            }
        });
        res.redirect("/blogs")

    })

app.listen(process.env.PORT || 3000, (req, res) => {
    console.log("server started on port : 3000");
})