const Pokemon = require("../Pokemon/Pokemon");

class Party {
    _maxSlots = 6;
    _pokemon = [];

    constructor(party) {
        if(party){
            if(party._pokemon){
                this.pokemon = party._pokemon;
            }else{

            }
        }
    }


    get maxSlots() {
        return this._maxSlots;
    }

    set maxSlots(value) {
        this._maxSlots = value;
    }

    get pokemon() {
        return this._pokemon;
    }

    addPokemon(pokemon){
        this._pokemon.push(new Pokemon(pokemon));
    }

    set pokemon(value) {
        if(value){
            value.forEach(pokemon => {
                this._pokemon.push(new Pokemon(pokemon));
            });
        }
    }
}

module.exports = Party
