const Helper = require("../../helpers/Helper")
const Iv = require("./Iv");
const Ev = require("./Ev");
const Move = require("../Combat/Move");

class Pokemon {
    _number;
    _name;
    _moves = [];
    _lvl;
    _shiny;
    _iv;
    _ev;
    _gender;

    constructor(pokemon) {
        if(pokemon){
            this.number = pokemon._number;
            this.name = pokemon._name;
            this.lvl = pokemon._lvl;
            this.shiny = pokemon._shiny;
            this.moves = pokemon._moves;
            this.iv = pokemon._iv;
            this.ev = pokemon._ev;
            this.gender = pokemon._gender;
        }
    }


    get number() {
        return this._number;
    }

    set number(value) {
        this._number = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get moves() {
        return this._moves;
    }

    set moves(value) {
        value.forEach(move => {
            this._moves.push(new Move(move));
        });
    }

    get lvl() {
        return this._lvl;
    }

    set lvl(value) {
        this._lvl = value;
    }

    get shiny() {
        return this._shiny;
    }

    set shiny(value) {
        this._shiny = value;
    }

    get iv() {
        return this._iv;
    }

    set iv(value) {
        this._iv = new Iv(value);
    }

    get ev() {
        return this._ev;
    }

    set ev(value) {
        this._ev = new Ev(value);
    }

    get gender() {
        return this._gender;
    }

    set gender(value) {
        this._gender = value;
    }

    async fillMoves(){
        this.moves = await Helper.getMoves(this.name);
    }
}

module.exports = Pokemon
