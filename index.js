//Express
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const path = require('path');

//Models
const Pokemon = require("./models/Pokemon/Pokemon");
const User = require("./models/Player/User");
const Bag = require("./models/Player/Bag/Bag");
const Location = require("./models/Player/Location");
const Party = require("./models/Player/Party");
const Pc = require("./models/Pc/Pc");
const Wallet = require("./models/Player/Wallet");

//Auth
const { auth } = require('express-openid-connect');
const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
require("dotenv").config();
const authRouter = require("./auth");

//Socket
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

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
//io.use(wrap(expressSession(session)));


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
//io.use(wrap(passport.initialize()));
//io.use(wrap(passport.session()));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
/*
//TODO THE FUK
io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("unauthorized"))
  }
});
*/


app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(expressSession(session)));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));


const secured = (req, res, next) => {
  if (req.oidc.user) {
    io.use(async (socket, next) => {
      socket.request.req = req;
      socket.request.res = res;
      socket.request.user = await UserModel.findOne({ auth: req.oidc.user.sub }).exec();
      if(!!socket.request.user){
        next();
      }
    });
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/login");
};

// Router mounting
app.use("/", authRouter);

app.get("/", (req, res) => {
  renderPage(req, res, "index");
});

app.get("/user", secured, (req, res, next) => {
  console.log(req.oidc.user)
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

app.get("/test", secured, (req, res, next) => {
  requestToObject(req).then(async function(user){
    user.testAdditions();
    const newUser = await saveUser(user, req);
    renderPage(req, res, "test", newUser);
  });

});

app.post('/editUser', async function (req, res, next) {
  req.body.user._username = req.body.username;
  res.send(await saveUser(req.body.user, req));
})

app.post('/createLobby', async function (req, res, next) {
  if(io.sockets.adapter.rooms[req.body.lobbyName]){
    res.send(new Error("lobby exists"));
  }else{
    console.log("hello body pls", req.body.lobbyName);
    res.send(req.body.lobbyName);
    //res.redirect(200, "/game");
  }
})

app.post('/joinLobby', async function (req, res, next) {
  if(io.sockets.adapter.rooms.has(req.body.lobbyName))
  {
    res.send(req.body.lobbyName);
  }else{
    //TODO room no exist
    res.send(new Error("room not found"));
  }
});
/*
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

 */


/*
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
});

 */

io.on('connection', (socket) => {
  //TODO socket.request.user
  const thisUser = new User(socket.request.user);
  thisUser.socketID = socket.id;
  socket.emit("initUser", thisUser);
  socket.on("getAllRooms", ()=> {
    socket.emit("displayRooms", [...io.sockets.adapter.rooms]);
  });
  socket.on("createLobby", (lobbyName) => {
    console.log("create lobby");
    createLobby(socket.id, lobbyName);
  });
  socket.on("joinLobby", (lobbyName) => {
    joinLobby(socket.id, lobbyName);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port);

function sendAllRooms(socket){
  socket.emit("displayRooms", [...io.sockets.adapter.rooms]);
}

function updateLobby(lobbyName){
  const clientSockets = getClientSocketsFromRoom(lobbyName);
  const users = [];
  clientSockets.forEach(clientSocket => {
    users.push(clientSocket.request.user.user);
  });
  clientSockets.forEach(clientSocket => {
    clientSocket.emit("updateLobby", users);
  });
}

function getClientSocketsFromRoom(lobbyName){
  let clientSockets = [];
  const clients = io.sockets.adapter.rooms.get(lobbyName);
  for (const clientId of clients ) {
    clientSockets.push(io.sockets.sockets.get(clientId));
  }
  return clientSockets;
}

function createLobby(socketId, lobbyName){
  console.log(socketId);
  const socket = io.sockets.sockets.get(socketId);
  socket.join(lobbyName);
  //renderPage(socket.request.req, socket.request.res, "play", socket.request.user);
  updateLobby(lobbyName);
}

function joinLobby(socketId, lobbyName){
  const socket = io.sockets.sockets.get(socketId);
  socket.join(lobbyName);
  //sendAllRooms(socket);
  updateLobby(lobbyName);
}

async function checkAuth(auth){
  const mongoUser = await UserModel.findOne({ auth: auth }).exec();
  return !!mongoUser;
}

async function saveUser(user, req){
  //console.log(req.oidc.user.sub);
  const mongoUser = await UserModel.findOne({ auth: req.oidc.user.sub }).exec();
  //console.log('157', mongoUser);
  if(mongoUser){
    return await updateUser(mongoUser, user);
  }else{
    const userInstance = newUserModel(user);
    const newUser = await userInstance.save();
    //console.log("163", newUser);
    newUser.user._id = newUser._id;
    return newUser.user;
  }
}

function newUserModel(user){
  if(isReqUser(user)){
    return new UserModel(reqUserToObj(user));
  }else{
    return new UserModel({
      auth: user.auth,
      user: new User(user)
    });
  }
}

function reqUserToObj(reqUser){
  return {
    auth: reqUser.sub,
    user: {
      _username: reqUser.given_name,
      _party: new Party(),
      _pc: new Pc(),
      _bag: new Bag(),
      _wallet: new Wallet(),
      _location: new Location()
    }
  }
}

function isReqUser(user){
  return !!user.sub;
}

async function updateUser(old, updated){
  old.user = updated;
  //console.log("200", updated);
  return UserModel.findOneAndUpdate(old._id,{user: updated},  {
    new: true
  });
}


async function requestToObject(req){
  const { _raw, _json, ...reqUser } = req.oidc.user;
  const mongoUser = await UserModel.findOne({ auth: reqUser.sub }).exec();
  //console.log("210", mongoUser)
  if(mongoUser){
    //console.log("212", mongoUser.user)
    return new User(mongoUser);
  }else{
    return saveUser(req.oidc.user, req);
  }
}

function renderPage(req, res, route, user){
  if(user){
    res.render(route, {
      title: user._username,
      user: user
    });
  }
  else if(isLoggedIn(req)){
    requestToObject(req).then(function(user){
      //console.log("222", user)
      res.render(route, {
        title: user._username,
        user: user
      });
    });
  }else if(isPublicRoute(route)){
    res.render(route, {
      title: "PokeClone",
      user: false
    });
  }
  else{
    res.redirect("/login");
  }
}

function isLoggedIn(req){
  //console.log("240", req.oidc.user);
  return !!req.oidc.user;
}

const publicRoutes = ["index"]

function isPublicRoute(route){
  return publicRoutes.includes(route);
}
