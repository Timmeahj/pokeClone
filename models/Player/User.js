const Party = require("./Party");
const Pc = require("../Pc/Pc");
const Bag = require("./Bag/Bag");
const Wallet = require("./Wallet");
const Location = require("./Location");
const FriendList = require("../Friends/FriendList");
const Pokemon = require("../Pokemon/Pokemon");
const Move = require("../Combat/Move");
const Item = require("./Bag/Item");
const Effect = require("../Combat/Effect");
const Socket = require("../Socket/Socket");

class User {
    _id;
    _username = 'Anonymous';
    _party;
    _pc;
    _bag;
    _wallet;
    _location;
    _friendList;
    _socketID;

    constructor(mongoUser) {
        let user = false;
        if(mongoUser){
            user = mongoUser.user;
        }
        if(user){
            this.id = mongoUser._id;
            this.username = user._username;
            this.party = user._party;
            this.pc = user._pc;
            this.bag = user._bag;
            this.wallet = user._wallet;
            this.location = user._location;
            this.friendList = user._friendList;
        }else{
            //TODO testing
        }
    }


    get socketID() {
        return this._socketID;
    }

    set socketID(value) {
        this._socketID = value;
    }

    get friendList() {
        return this._friendList;
    }

    set friendList(value) {
        this._friendList = new FriendList(value);
    }

    get party() {
        return this._party;
    }

    set party(value) {
        this._party = new Party(value);
    }

    get pc() {
        return this._pc;
    }

    set pc(value) {
        this._pc = new Pc(value);
    }

    get bag() {
        return this._bag;
    }

    set bag(value) {
        this._bag = new Bag(value);
    }

    get wallet() {
        return this._wallet;
    }

    set wallet(value) {
        this._wallet = new Wallet(value);
    }

    get location() {
        return this._location;
    }

    set location(value) {
        this._location = new Location(value);
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

    testAdditions(){
        const charmander = {
            name: "charmander",
            id: 4,
            lvl: 5,
            shiny: false,
            moves: [
                new Move({
                    name: "tackle",
                    dmg: 50,
                    pp: 30,
                    acc: 95,
                    effect: null,
                    description: "tackle dat boi"
                }),
                new Move({
                    name: "growl",
                    dmg: 0,
                    pp: 20,
                    acc: 100,
                    effect: null,
                    description: "rawr"
                })
            ],
            gender: "male"
        };
        this.bag.addItem({
            name: "rare candy",
            effect: new Effect("lvl up"),
            description: "levels up a poke level",
            sprite: "img.jpg",
            category: "consumables"
        });
        this.pc.addBox({
            name: "Box 1",
            pokemonStored: [charmander]
        });
        this.party.addPokemon(charmander);
        this.pc.receiveMail({
            receiver: this._username,
            sender: "Tim",
            attachments: new Item({
               name: "rare candy",
               effect: new Effect("lvl up"),
               description: "levels up a poke level",
               sprite: "img.jpg",
               category: "consumables"
            }),
            dateSent: new Date(),
            dateRead: new Date()
        });
        this.wallet.dollar += 100;
        this.wallet.gold += 10;
        this.location = {
            x: 50,
            y: 30,
            mapId: "Pallet Town"
        }
    }
}

module.exports = User
