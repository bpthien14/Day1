cc.Class({
    extends: cc.Component,

    properties: {
        dmgTextPrefab: cc.Prefab,
        normalColor: {
            default: cc.Color.RED,
            type: cc.Color
        },
        dotColor: {
            default: new cc.Color(255, 165, 0), 
            type: cc.Color
        }
    },

    showDamageText(worldPos, damage, isDot = false) {
        const dmgText = cc.instantiate(this.dmgTextPrefab);
        dmgText.parent = this.node;
        dmgText.position = this.node.convertToNodeSpaceAR(worldPos);

        const label = dmgText.getComponent(cc.Label);
        if (label) {
            label.string = Math.ceil(damage).toString();
            label.node.color = isDot ? this.dotColor : this.normalColor;
        }

        const moveUp = cc.moveBy(1, cc.v2(0, 50));
        const fadeOut = cc.fadeOut(1);
        dmgText.runAction(cc.sequence(
            cc.spawn(moveUp, fadeOut),
            cc.removeSelf()
        ));
    }
});