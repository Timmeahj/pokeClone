//Express
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const path = require('path');

//Models
const Pokemon = require("./models/Pokemon");
const User = require("./models/User");
const Bag = require("./models/Bag");
const Location = require("./models/Location");
const Party = require("./models/Party");
const Pc = require("./models/Pc");
const Wallet = require("./models/Wallet");

//Auth
const { auth } = require('express-openid-connect');
const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
require("dotenv").config();
const authRouter = require("./auth");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + '/public'));
app.use(express.json());


//Auth config
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: 'http://localhost:8000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_DOMAIN
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

//Mongoose with connection string
const mongoose = require('mongoose');
const {mongo} = require("mongoose");
const uri = "mongodb+srv://admin:"+process.env.MONGO_PASS+"@learningapp.gabu4.mongodb.net/PokeClone?retryWrites=true&w=majority";

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(uri);
}

//TODO make function to make schema from class
const userSchema = new mongoose.Schema({
  auth: String,
  user: Object
});

//TODO make function to make model from schema
const UserModel = mongoose.model('User', userSchema);

const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false
};

if (app.get("env") === "production") {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}
app.use(expressSession(session));


const strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
      /**
       * Access tokens are used to authorize users to an API
       * (resource server)
       * accessToken is the token to call the Auth0 API
       * or a secured third-party API
       * extraParams.id_token has the JSON Web Token
       * profile has all the information from the user
       */
      return done(null, profile);
    }
);

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

const secured = (req, res, next) => {
  if (req.oidc.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/login");
};

// Router mounting
app.use("/", authRouter);

app.get("/", (req, res) => {
  res.render("index", {
    title: "PokeClone",
    user: false
  });
});

app.get("/user", secured, (req, res, next) => {
  renderPage(req, res, "user");
});

app.get("/menu", secured, (req, res, next) => {
  renderPage(req, res, "menu")
});

app.get("/user/edit", secured, (req, res, next) => {
  renderPage(req, res, "edit/editUser")
});

app.get("/game", secured, (req, res, next) => {
  renderPage(req, res, "play")
});

app.post('/editUser', function (req, res, next) {
  req.body.user._username = req.body.username;
  saveUser(req.body.user);
  res.send(req.body.user);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

async function getUserFromRequest(reqUser){
  return UserModel.findOne({id: reqUser._id});
}

function saveUser(user){
  getUserFromRequest(user).then(async function(data) {
    if(!data) {
      const userInstance = newUserModel(user);
      userInstance.save().then();
    }else{
      const updatedUser = await updateUser(usernameUpdateQuery(user), user._id);
    }
  })
}

function newUserModel(user){
  return new UserModel({
    auth: user.auth,
    user: new User(user)
  });
}

function usernameUpdateQuery(user){
  return {username: user._username};
}

async function updateUser(query, userId){
  return UserModel.findOneAndUpdate({ _id: userId }, query, {
    new: true
  });
}


async function requestToObject(reqUser){
  const mongoUser = await getUserFromRequest(reqUser);
  console.log("mongo user", mongoUser)
  if(mongoUser){
    return new User(mongoUser);
  }else{
    saveUser(reqUser);
    return await requestToObject(reqUser);
  }
}

function renderPage(req, res, route){
  if(isLoggedIn(req)){
    const { _raw, _json, ...reqUser } = req.oidc.user;
    requestToObject(reqUser).then(function(user){
      console.log("user when render", user)
      res.render(route, {
        title: user.username,
        user: user
      });
    });
  }else{
    res.render("login", {
      title: "Log in",
      user: false
    });
  }
}

function isLoggedIn(req){
  console.log("user logged in?", req.oidc.user);
  return req.oidc.user;
}
