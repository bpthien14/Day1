// Gắn script này vào Canvas hoặc node chứa button
cc.Class({
    extends: cc.Component,
    properties: {
        testNode: cc.Node
    },

    onLoad() {
        this.node.on('click', this.toggleNode, this);
    },

    toggleNode() {
        this.testNode.active = !this.testNode.active;
    }
});
