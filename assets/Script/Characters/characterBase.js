cc.Class({
    extends: cc.Component,

    properties: {
        hp: 100,
        moveSpeed: 50,
        attackDamage: 20,
        attackInterval: 1,
    },

    init(controller) {
        this.controller = controller;
        this.damageTextManager = cc.find("Canvas").getComponent("DamageTextManager"); 
        if (!this.damageTextManager) {
            console.warn("DamageTextManager not found! Please add damageTextManager component to Canvas.");
        }
    },

    onLoad() {
        this.isMoving = true;
        this.isAttacking = false;
        this.targetTower = null;
    },

    update(dt) {
        if (this.isMoving) {
            this.node.x -= this.moveSpeed * dt * 2;
        }

        if (this.isAttacking && (!this.targetTower || !this.targetTower.isValid)) {
            this.resumeMovement();
        }

        if (this.node.x < -cc.winSize.width) {
            this.onKilled();
        }
    },


    onCollisionEnter: function (other, self) {
        if (other.node.group === "Turret") {
            this.stopWalkEffect();
            this.node.angle = 0;

            this.isMoving = false;
            this.isAttacking = true;
            this.targetTower = other.node;

            const dogWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
            const towerWorldPos = other.node.convertToWorldSpaceAR(cc.v2(0, 0));
            this.lastCollisionPos = cc.v2(
                (dogWorldPos.x + towerWorldPos.x) / 2,
                (dogWorldPos.y + towerWorldPos.y) / 2
            );

            this.attack();
            
            this.schedule(this.attack, this.attackInterval);
        }
    },

    onCollisionExit: function (other, self) {
        if (other.node === this.targetTower) {
            this.resumeMovement();
        }
    },

    attack() {
        if (this.targetTower && this.targetTower.isValid) {
            this.playAttackEffect(() => {
                if (this.targetTower && this.targetTower.isValid) {
                    const towerItem = this.targetTower.getComponent("towerItem");
                    if (towerItem) {
                        towerItem.onHit(this.attackDamage);
                        this.showDamageAtPosition(this.lastCollisionPos, this.attackDamage);
                    }
                }
            });
        }
    },

    showDamageAtPosition(worldPos, damage) {
        if (!this.damageTextManager) {
            this.damageTextManager = cc.find("Canvas").getComponent("DamageTextManager");
            if (!this.damageTextManager) return;
        }
        if (!worldPos) return;
        this.damageTextManager.showDamageText(worldPos, damage);
    },

    resumeMovement() {
        this.startWalkEffect();
        this.unschedule(this.attack);
        this.isMoving = true;
        this.isAttacking = false;
        this.targetTower = null;
    },

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.onKilled();
        }
    },

    onKilled() {
        if (this.controller) {
            this.controller.onMonsterKilled(this.node);
        }
        this.node.destroy();
    },

    playAttackEffect(callback) {

    },

    startWalkEffect() {
    },

    stopWalkEffect() {
    }
});