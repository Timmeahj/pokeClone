//const User = require("../../models/Player/User");

function editUserRequest(){
    axios.post("http://localhost:8000/editUser/", {
        user: userObj,
        username: document.getElementById("username").value
    }).then(function (data){
        location = "/user";
        return data.data;
    }).then(function (user){
        console.log(user)
    });
}

function createLobby(){
    axios.post("http://localhost:8000/createLobby/", {
        socketId: socket.id,
        lobbyName: document.getElementById("lobbyName").value
    }).then(data => {
        console.log(data.data);
        return data;
    }).then(res =>{
        console.log(res.data);
        socket.emit("createLobby", res.data);
    });
}

function joinLobby(){
    axios.post("http://localhost:8000/joinLobby/", {
        socketId: socket.id,
        lobbyName: document.getElementById("lobbyName").value
    }).then(lobbyName => {
        location = "/game";
        return lobbyName;
    }).then(res =>{
        socket.emit("joinLobby", res.data);
    });
}

socket.on("initUser", (user) => {
    console.log(user)
    socket.emit("getAllRooms");
});

socket.on("displayRooms", (rooms) => {
    console.log(rooms);
    [...rooms].forEach(room => {
       console.log(room);
    });
});

socket.on("updateLobby", (users) => {
    //console.log(users);
    const userObjects = [];
    users.forEach(user => {
       //userObjects.push(new User(user));
    });
    console.log(userObjects);
});

socket.on("joinLobby", (lobbyName) => {
    displayLobby(lobbyName);
    socket.emit("getLobbyPlayers", lobbyName);
});

function displayLobby(lobbyName){
    console.log(lobbyName);
}
/*
document.getElementById("createLobby").addEventListener("click", function (){
   //socket.emit("createLobby", document.getElementById("lobbyName").value);

});

document.getElementById("joinLobby").addEventListener("click", function (){
    axios.post("http://localhost:8000/joinLobby/", {
        socket: socket,
        lobbyName: document.getElementById("lobbyName").value
    });
});*/
