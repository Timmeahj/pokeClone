const json = require('../json/pokemon.json');
const {pokemon} = json;
const fetch = require('node-fetch');

class Helper{
    static allPokemon = pokemon;

    static async fetchPokemon(url){
        const data = await fetch(url);
        console.log(data);
        return await data.json();
    }

    static async getPokeByName(name){
        return await this.fetchPokemon(this.allPokemon.find(pokemon => pokemon.name === name));
    }

    static async getMoves(name) {
        const pokemon = await this.getPokeByName(name);
        return pokemon.moves;
    }
}

module.exports = Helper;
