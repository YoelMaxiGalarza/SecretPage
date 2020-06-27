const express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
    User = require("./models/user");

mongoose.connect("mongodb://localhost/auth_demo_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


var app = express();
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the work",
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({ extended: true }));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

//====================
//ROUTES
//====================
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/secret", (req, res) => {
    res.render("secret");
});
//------------------
//AUTH ROUTES
//------------------
//Show Sign Up Form
app.get("/register", function (req, res) {
    res.render("register");
});
//Handling User Sing Up
app.post("/register", (req, res) => {
    req.body.username
    req.body.password
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res,function(){
            res.redirect("/secret");
        });

    });
});
//LOGIN ROUTES
//Render Login Form
app.get("/login", (req, res)=>{
    res.render("login");
});
//Login Logic
//middleware
app.post("/login", passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login" 
}) ,(req, res)=>{
});
//Log Out
app.get("/logout", (req, res)=>{
    res.send("OK I WILL LOG YOU OUT. not yet though...")
});


app.listen(4000, () => {
    console.log("Server on !!")
});