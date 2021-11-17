class Iv {
    _atk;
    _spa;
    _def;
    _spd;
    _hp;
    _spe;

    constructor(iv) {
        if(iv){
           this.atk = iv._atk;
           this.spa = iv._spa;
           this.def = iv._def;
           this.spd = iv._spd;
           this.hp = iv._hp;
           this.spe = iv._spe;
        }else{
            this.atk = this.randomBetween(0,31);
            this.spa = this.randomBetween(0,31);
            this.def = this.randomBetween(0,31);
            this.spd = this.randomBetween(0,31);
            this.hp = this.randomBetween(0,31);
            this.spe = this.randomBetween(0,31);
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

    randomBetween(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

}

module.exports = Iv