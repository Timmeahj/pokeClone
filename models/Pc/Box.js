const Pokemon = require("../Pokemon/Pokemon");

class Box {
    _name;
    _pokemonStored = [];

    constructor(box) {
        if(box){
            this.name = box._name;
            this.pokemonStored = box._pokemonStored;
        }
    }


    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get pokemonStored() {
        return this._pokemonStored;
    }

    set pokemonStored(value) {
        value.forEach(pokemon => {
            this._pokemonStored.push(new Pokemon(pokemon));
        });
    }


}

module.exports = Box
