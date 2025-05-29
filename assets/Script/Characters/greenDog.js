const characterBase = require('characterBase');

cc.Class({
    extends: characterBase,

    properties: {
        hp: 80, 
    },

    onLoad() {
        this._super();

        this.node.group = "GreenDog";

        this.walkTween = cc.tween(this.node)
            .repeatForever(
                cc.tween().to(0.5, { angle: 5 }).to(0.5, { angle: -5 })
            );
        
        this.startWalkEffect();

    },


    startWalkEffect() {
        this._super();
        this.walkTween.start();
    },

    stopWalkEffect() {
        this._super();
        this.walkTween.stop();
    },

    playAttackEffect(callback) {
        this._super(callback);
        cc.tween(this.node)
            .by(0.1, { x: -20 })
            .by(0.1, { x: 20 })
            .call(() => {
                if (callback) {
                    callback();
                }
            })
            .start();
    }
});