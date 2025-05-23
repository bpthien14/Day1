cc.Class({
    extends: cc.Component,

    properties: {
        userID: 20,
        userName: "Foobar",
        score: {
            default: 0,
            displayName: "Score (player)",
            // tooltip: "The score of the player",
        },
        width: {
            get: function () {
                return this._width;
            },
            set: function (value) {
                this._width = value;
            },
        }
    },
    start() {},

});
