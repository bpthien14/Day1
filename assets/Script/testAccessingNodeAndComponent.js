cc.Class({
    extends: cc.Component,
    properties: {
        labelHello: {
            default: null,
            type: cc.Label
        },
    },

    testFunc() {
        let label = this.node.getComponent(cc.Label);
        if (label) {
            label.string = "Hello";
        } else {
            cc.error("Something wrong?");
        }
        // label.string = text;
        let helloComp = this.node.getComponent("say-hello");
        label.string = label.string + " " + helloComp.userName + " " + helloComp.userID;
    },

    start() {
        this.testFunc();
    },
});
