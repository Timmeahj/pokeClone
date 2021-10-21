const Party = require("./Party");
const Pc = require("./Pc");
const Bag = require("./Bag");
const Wallet = require("./Wallet");
const Location = require("./Location");

class User {
    _id;
    _username;
    _party = new Party();
    _pc = new Pc();
    _bag = new Bag();
    _wallet = new Wallet();
    _location = new Location();

    constructor(user) {
        if(user){
            this._id = user._id;
            this._username = user.username;
            this._party = user.party;
            this._pc = user.pc;
            this._bag = user.bag;
            this._wallet = user.wallet;
            this._location = user.location;
        }else{
            this._username = "Anonymous";
            this._party = new Party();
            this._pc = new Pc();
            this._bag = new Bag();
            this._wallet = new Wallet();
            this._location = new Location();
        }


    }

    get party() {
        return this._party;
    }

    set party(value) {
        this._party = value;
    }

    get pc() {
        return this._pc;
    }

    set pc(value) {
        this._pc = value;
    }

    get bag() {
        return this._bag;
    }

    set bag(value) {
        this._bag = value;
    }

    get wallet() {
        return this._wallet;
    }

    set wallet(value) {
        this._wallet = value;
    }

    get location() {
        return this._location;
    }

    set location(value) {
        this._location = value;
    }

    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }
}

module.exports = User
