const Box = require("./Box");
const Mail = require("./Mail");

class Pc {
    _boxes = [];
    _mailBox = [];

    constructor(pc) {
        if(pc){
            this.boxes = pc._boxes;
            this.mailBox = pc._mailbox;
        }
    }


    get boxes() {
        return this._boxes;
    }

    set boxes(value) {
        if(value){
            value.forEach(box => {
                this._boxes.push(new Box(box));
            });
        }
    }

    addBox(box){
        this._boxes.push(new Box(box));
    }

    receiveMail(mail){
        this._mailBox.push(new Mail(mail));
    }

    get mailBox() {
        return this._mailBox;
    }

    set mailBox(value) {
        if(value){
            value.forEach(mail => {
                this._mailBox.push(new Mail(mail));
            });
        }
    }
}

module.exports = Pc
