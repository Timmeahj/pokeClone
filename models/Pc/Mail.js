class Mail {
    _sender;
    _receiver;
    _attachments;
    _dateSent;
    _dateRead;

    constructor(mail) {
        if(mail){
            this.sender = mail._sender;
            this.receiver = mail._receiver;
            this.attachments = mail._attachments;
            this.dateSent = mail._dateSent;
            this.dateRead = mail._dateRead;
        }
    }


    get sender() {
        return this._sender;
    }

    set sender(value) {
        this._sender = value;
    }

    get receiver() {
        return this._receiver;
    }

    set receiver(value) {
        this._receiver = value;
    }

    get attachments() {
        return this._attachments;
    }

    set attachments(value) {
        this._attachments = value;
    }

    get dateSent() {
        return this._dateSent;
    }

    set dateSent(value) {
        this._dateSent = value;
    }

    get dateRead() {
        return this._dateRead;
    }

    set dateRead(value) {
        this._dateRead = value;
    }
}

module.exports = Mail