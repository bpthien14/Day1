cc.Class({
    extends: cc.Component,

    properties: {
        hp: {
            default: 500,
        },
        hpBar: {
            default: null,
            type: cc.ProgressBar,
        }
    },

    onLoad() {
        this.node.group = 'Turret';
        this.currentHp = this.hp;

        if (this.hpBar) {
            this.hpBar.progress = 1;
        }

        this.originalPos = this.node.position;
        this.originalColor = this.node.color;
    },

    onHit(damage) {
        this.node.color = cc.Color.RED;
        
        cc.tween(this.node)
            .to(0.05, { position: cc.v2(this.originalPos.x + 5, this.originalPos.y) })
            .to(0.05, { position: cc.v2(this.originalPos.x - 5, this.originalPos.y) })
            .to(0.05, { position: this.originalPos }) 
            .call(() => {
                this.node.color = this.originalColor;
            })
            .start();

        this.takeDamage(damage);
    },

    takeDamage(damage) {
        this.currentHp -= damage;
        
        if (this.hpBar) {
            this.hpBar.progress = this.currentHp / this.hp;
        }

        if (this.currentHp <= 0) {
            this.currentHp = 0;
            this.onKilled();
        }
    },

    onKilled() {
        this.node.active = false;
    }
});