class Bag {
    name = "bag";

    constructor() {
    }

    doesItWork(){
        return "bag works";
    }

    toObject(){
        return {name: this.name};
    }
}

module.exports = Bag
