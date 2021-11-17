const Effect = require("../../Combat/Effect");

class Item {
    _name;
    _effect;
    _description;
    _sprite;
    _category;

    constructor(item) {
        this.name = item._name;
        this.effect = item._effect;
        this.description = item._description;
        this.sprite = item._sprite;
        this.category = item._category;
    }


    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get effect() {
        return this._effect;
    }

    set effect(value) {
        this._effect = new Effect(value);
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get sprite() {
        return this._sprite;
    }

    set sprite(value) {
        this._sprite = value;
    }

    get category() {
        return this._category;
    }

    set category(value) {
        this._category = value;
    }
}

module.exports = Item