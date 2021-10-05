const Helper = require("../helpers/Helper")

class Pokemon {
    number;
    name;
    moves;
    lvl;
    shiny;
    iv;
    ev;
    gender;

    constructor(number, name) {
        this.number = number;
        this.name = name;
    }

    async fillMoves(){
        this.moves = await Helper.getMoves(this.name);
    }
}

module.exports = Pokemon
