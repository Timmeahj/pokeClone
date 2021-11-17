class Wallet {
    _dollar;
    _gold;

    constructor(wallet) {
        if(wallet && wallet.dollar && wallet.gold){
            this.dollar = wallet._dollar;
            this.gold = wallet._gold;
        }
        else{
            this.dollar = 0;
            this.gold = 0;
        }
    }

    get dollar() {
        return this._dollar;
    }

    set dollar(value) {
        this._dollar = value;
    }

    get gold() {
        return this._gold;
    }

    set gold(value) {
        this._gold = value;
    }
}

module.exports = Wallet
