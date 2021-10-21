
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
