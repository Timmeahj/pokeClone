class Effect {
    _name;

    constructor(effect) {
        this.name = effect._name;
    }


    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }
}

module.exports = Effect