const characterBase = require('characterBase');

cc.Class({
    extends: characterBase,

    properties: {
        hp: 80, 
        overide: true,
        hpBar: {
            default: null,
            type: cc.ProgressBar,
        }
    },

    onLoad() {
        this._super();
        
        if (this.hpBar) {
            this.hpBar.progress = 1;
        }
        
        this.node.group = "GreenDog";

        this.walkTween = cc.tween(this.node)
            .repeatForever(
                cc.tween().to(0.5, { angle: 5 }).to(0.5, { angle: -5 })
            );
    },

    startWalkEffect() {
        this._super();
        if (this.walkTween) {
            try {
                this.walkTween.stop();  
                this.walkTween.start();
            } catch (error) {
                cc.error("Error starting walkTween:", error);
            }
        } else {
            cc.warn("walkTween not initialized in greenDog");
        }
    },

    stopWalkEffect() {
        this._super();
        if (this.walkTween) {
            try {
                this.walkTween.stop();
            } catch (error) {
                cc.error("Error stopping walkTween:", error);
            }
        }
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