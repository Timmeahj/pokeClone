class Location {
    //which building / location
    _mapId;
    _x;
    _y;

    constructor(location) {
        if(location){
            this.x = location._x;
            this.y = location._y;
            this.mapId = location._mapId;
        }
    }


    get mapId() {
        return this._mapId;
    }

    set mapId(value) {
        this._mapId = value;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }
}

module.exports = Location
