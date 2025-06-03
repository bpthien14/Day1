cc.Class({
    extends: cc.Component,

    properties: {
        canvas: {
            default: null,
            type: cc.Node,
        },
        damageLayer: {
            default: null,
            type: cc.Node,
        }
    },

    onLoad() {
        if (!this.canvas) {
            this.canvas = cc.find("Canvas");
        }
        if (!this.damageLayer) {
            this.damageLayer = new cc.Node("DamageLayer");
            this.canvas.addChild(this.damageLayer);
        }
        this.damageTextPool = [];
        this.initPool(10);
    },

    initPool(poolSize) {
        for (let i = 0; i < poolSize; i++) {
            const damageNode = this.createDamageTextNode();
            damageNode.active = false;
            this.damageLayer.addChild(damageNode);
            this.damageTextPool.push(damageNode);
        }
    },

    createDamageTextNode() {
        const node = new cc.Node("DamageText");
        
        const label = node.addComponent(cc.Label);
        label.fontSize = 30;
        label.fontFamily = "Arial";
        label.string = "";
        
        node.color = cc.Color.RED;
        label.enableOutline = true;
        label.outlineColor = cc.Color.WHITE;
        label.outlineWidth = 2;
        
        return node;
    },

    showDamageText(worldPosition, damage) {
        const damageNode = this.getDamageTextFromPool();
        if (!damageNode) return;

        const canvasPosition = this.convertWorldToCanvasPosition(worldPosition);
        if (!canvasPosition) {
            this.returnDamageTextToPool(damageNode);
            return;
        }
        
        const label = damageNode.getComponent(cc.Label);
        label.string = "-" + damage;
        
        damageNode.position = canvasPosition;
        damageNode.active = true;
        damageNode.opacity = 255;
        damageNode.scale = 0.8;

        this.playDamageAnimation(damageNode);
    },

    convertWorldToCanvasPosition(worldPosition) {
        return this.canvas.convertToNodeSpaceAR(worldPosition);
    },

    playDamageAnimation(damageNode) {
        const moveUpAction = cc.moveBy(1.0, cc.v2(0, 100));
        const scaleAction = cc.scaleTo(0.2, 1.2);
        const fadeAction = cc.sequence(
            cc.delayTime(0.5),
            cc.fadeOut(0.5)
        );

        const completeAction = cc.callFunc(() => {
            this.returnDamageTextToPool(damageNode);
        });

        damageNode.runAction(cc.spawn(
            moveUpAction,
            fadeAction
        ));
        
        damageNode.runAction(cc.sequence(
            scaleAction,
            cc.scaleTo(0.1, 1.0),
            completeAction
        ));
    },

    getDamageTextFromPool() {
        for (let i = 0; i < this.damageTextPool.length; i++) {
            if (!this.damageTextPool[i].active) {
                return this.damageTextPool[i];
            }
        }
        
        const newNode = this.createDamageTextNode();
        newNode.active = false;
        this.damageLayer.addChild(newNode);
        this.damageTextPool.push(newNode);
        return newNode;
    },

    returnDamageTextToPool(damageNode) {
        damageNode.active = false;
        damageNode.stopAllActions();
        damageNode.position = cc.v2(0, 0);
        damageNode.scale = 1.0;
        damageNode.opacity = 255;
    }
});