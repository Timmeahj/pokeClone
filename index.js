// index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const path = require('path');
const Pokemon = require("./models/Pokemon");
const User = require("./models/User");
const bodyParser = require('body-parser');
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
app.use(bodyParser.urlencoded({extended: false}));

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

const mongoose = require('mongoose');
const uri = "mongodb+srv://admin:"+process.env.MONGO_PASS+"@learningapp.gabu4.mongodb.net/PokeClone?retryWrites=true&w=majority";

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(uri);
}

const userSchema = new mongoose.Schema({
  id: String,
  username: String
});

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
  if(req.oidc.user){
    const { _raw, _json, ...user } = req.oidc.user;
    const userObject = requestToObject(user);
    saveUser(userObject);
    res.render("index", {
      title: "PokeClone",
      user: userObject
    });
  }else{
    res.render("index", {
      title: "PokeClone",
      user: false
    });
  }
});

app.get("/user", secured, (req, res, next) => {
  const { _raw, _json, ...user } = req.oidc.user;
  const userObject = requestToObject(user);
  res.render("user", {
    title: userObject.name,
    user: userObject
  });
});

app.get("/menu", secured, (req, res, next) => {
  const { _raw, _json, ...user } = req.oidc.user;
  const userObject = requestToObject(user);
  res.render("menu", {
    title: "Menu",
    user: userObject
  });
});

app.get("/user/edit", secured, (req, res, next) => {
  const { _raw, _json, ...user } = req.oidc.user;
  const userObject = requestToObject(user);
  res.render("edit/editUser", {
    title: userObject.username,
    user: userObject
  });
});

app.get("/game", secured, (req, res, next) => {
  if(req.oidc.user){
    const { _raw, _json, ...user } = req.oidc.user;
    const userObject = requestToObject(user);
    res.render("play", {
      title: "PokeClone",
      user: userObject
    });
  }else{
    res.render("login", {
      title: "PokeClone",
      user: false
    });
  }
});

app.post('/editUser', function (req, res) {
  console.log(req.body.Body)
  console.log(req.headers)
  console.log(req.data)
  console.log("sicco u suk")
  res.send("change username");
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

async function getUserById(id){
  const user = await UserModel.findOne({id: id})
  console.log(user)
  return user;
}

function saveUser(user){
  const userInstance = new UserModel({ id: user.id, username: user.username });
  getUserById(userInstance.id).then(function(data) {
    console.log("after getuser", data)
    if(!data) {
      userInstance.save().then();
    }
  })
}

function requestToObject(reqUser){
  return new User(reqUser.sub, reqUser.given_name)
}
