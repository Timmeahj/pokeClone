class Move {
    _name;
    _description;
    _dmg;
    _acc;
    _effect;
    _pp;

    constructor(move) {
        if(move){
            this.name = move._name;
            this.description = move._description;
            this.dmg = move._dmg;
            this.acc = move._acc;
            this.effect = move._effect;
            this.pp = move._pp;
        }
    }


    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get dmg() {
        return this._dmg;
    }

    set dmg(value) {
        this._dmg = value;
    }

    get acc() {
        return this._acc;
    }

    set acc(value) {
        this._acc = value;
    }

    get effect() {
        return this._effect;
    }

    set effect(value) {
        this._effect = value;
    }

    get pp() {
        return this._pp;
    }

    set pp(value) {
        this._pp = value;
    }
}

module.exports = Move