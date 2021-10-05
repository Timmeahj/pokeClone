const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const Pokemon = require("./models/Pokemon")
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    const bulba = new Pokemon(1, "bulbasaur");
    bulba.fillMoves().then(()=>{
        console.log(bulba);
    });
})

/*
const bulba = new Pokemon(1, "bulbasaur");
bulba.fillMoves().then(()=>{
    console.log(bulba);
});*/



