document.getElementById('edit').addEventListener('click', function (){
    axios.post("http://localhost:8000/editUser/", [{
        username: "yeet"
    }]).then(function (data){
        console.log(data)
    });
})
