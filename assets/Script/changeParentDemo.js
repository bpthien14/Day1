cc.Class({
    extends: cc.Component,

    properties: {
        itemNode: {
            default: null,
            type: cc.Node
        },
        uiNode: {
            default: null,
            type: cc.Node
        },
        moveButton: {
            default: null,
            type: cc.Button
        }
    },

    onLoad() {
        this.originalParent = this.itemNode.parent;

        this.isInUiNode = false;

        this.moveButton.node.on('click', this.changeParent, this);
    },

    changeParent() {
        if (!this.isInUiNode) {
            console.log('➡️ Chuyển itemNode sang uiNode');
            this.itemNode.removeFromParent(false);
            this.uiNode.addChild(this.itemNode);
            this.itemNode.setPosition(0, 0);
        } else {
            console.log('⬅️ Chuyển itemNode về originalParent');
            this.itemNode.removeFromParent(false);
            this.originalParent.addChild(this.itemNode);
            this.itemNode.setPosition(0, 0);
        }

        this.isInUiNode = !this.isInUiNode;
    }
});
