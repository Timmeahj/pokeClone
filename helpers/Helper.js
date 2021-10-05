const json = require('../json/pokemon.json')
const {pokemon} = json;
//import fetch from "node-fetch";
const fetch = require('node-fetch');

class Helper{
    allPokemon = pokemon;

    static async fetchPokemon(url){
        const data = await fetch(url);
        console.log(data)
        return await data.json();
    }

    static async getPokeByName(name){
        return await this.fetchPokemon("https://pokeapi.co/api/v2/pokemon/1/");
    }

    static async getMoves(name) {
        const pokemon = await this.getPokeByName(name);
        return pokemon.moves
    }
}

module.exports = Helper
