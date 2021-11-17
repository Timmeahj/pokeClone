class FriendList {
    _friends = [];
    _blocked = [];
    _requests = [];

    constructor(friendList) {
        if(friendList){
            this.friends = friendList._friends;
            this.blocked = friendList._blocked;
            this.requests = friendList._requests;
        }
    }


    get friends() {
        return this._friends;
    }

    set friends(value) {
        this._friends = value;
    }

    get blocked() {
        return this._blocked;
    }

    set blocked(value) {
        this._blocked = value;
    }

    get requests() {
        return this._requests;
    }

    set requests(value) {
        this._requests = value;
    }
}

module.exports = FriendList
