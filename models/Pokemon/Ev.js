class Ev {
    _atk;
    _spa;
    _def;
    _spd;
    _hp;
    _spe;

    constructor(ev) {
        if (ev) {
            this.atk = ev._atk;
            this.spa = ev._spa;
            this.def = ev._def;
            this.spd = ev._spd;
            this.hp = ev._hp;
            this.spe = ev._spe;
        } else {
            this.atk = 0;
            this.spa = 0;
            this.def = 0;
            this.spd = 0;
            this.hp = 0;
            this.spe = 0;
        }
    }


    get atk() {
        return this._atk;
    }

    set atk(value) {
        this._atk = value;
    }

    get spa() {
        return this._spa;
    }

    set spa(value) {
        this._spa = value;
    }

    get def() {
        return this._def;
    }

    set def(value) {
        this._def = value;
    }

    get spd() {
        return this._spd;
    }

    set spd(value) {
        this._spd = value;
    }

    get hp() {
        return this._hp;
    }

    set hp(value) {
        this._hp = value;
    }

    get spe() {
        return this._spe;
    }

    set spe(value) {
        this._spe = value;
    }
}



module.exports = Ev