const EventEmitter = require("events");
class mEmitter {
    constructor() {
        this._emiter = new EventEmitter();
        this._emiter.setMaxListeners(100);
    }
    emit(...args) {
        this._emiter.emit(...args);
    }
    destroy() {
        this._emiter.removeAllListeners();
        this._emiter = null;
        mEmitter.instance = null;
    }

    registerEvent(event, listener) {
        this._emiter.on(event, listener);
    }
    registerOnce(event, listener) {
        this._emiter.once(event, listener);
    }
    removeEvent(event, listener) {
        this._emiter.removeListener(event, listener);
    }
}
mEmitter.instance = mEmitter.instance || new mEmitter();
module.exports = mEmitter;
