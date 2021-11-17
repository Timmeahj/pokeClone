const Item = require("./Item");
const Effect = require("../../Combat/Effect");

class Bag {
    _items = [];

    constructor(bag) {
        this.bag = bag;
    }

    set bag(value) {
        if(value && value._items){
            value._items.forEach(item => {
               this.addItem(item)
            });
        }
    }

    addItem(item){
        this._items.push(new Item(item));
    }
}

module.exports = Bag
