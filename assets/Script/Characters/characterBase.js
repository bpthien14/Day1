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
    },

    onLoad() {
        cc.director.getCollisionManager().enabled = true;

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
                    const towerController = this.targetTower.getComponent("towerController");
                    if (towerController) {
                        towerController.onHit(this.attackDamage);
                    }
                }
            });
        }
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