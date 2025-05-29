cc.Class({
    extends: cc.Component,

    properties: {
        hp: 100,
        moveSpeed: 40,
        attackDamage: {
            default: 20,
        },
        attackInterval: {
            default: 1,
        },
    },

    init(controller) {
        this.controller = controller;
    },

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        this.node.group = "GreenDog";

        this.isMoving = true;
        this.isAttacking = false;
        this.targetTower = null;

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;

        this.walkTween = cc.tween(this.node)
            .repeatForever(
                cc.tween().to(0.5, { angle: 5 }).to(0.5, { angle: -5 })
            );
        
        this.walkTween.start();
    },

    update(dt) {
        if (this.isMoving) {
            this.node.x -= this.moveSpeed * dt * 2;
        }

        if (
            this.isAttacking &&
            (!this.targetTower || !this.targetTower.isValid)
        ) {
            this.resumeMovement();
        }

        if (this.node.x < -cc.winSize.width - 100) {
            this.onKilled();
        }
    },

    onCollisionEnter: function (other, self) {
        if (other.node.group === "Turret") {
            this.walkTween.stop();
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
            const lunge = cc.tween(this.node)
                .by(0.1, { x: -20 })
                .by(0.1, { x: 20 })
                .call(() => {
                    if (this.targetTower && this.targetTower.isValid) {
                        const towerController = this.targetTower.getComponent("towerController");
                        if (towerController) {
                            towerController.onHit(this.attackDamage);
                        }
                    }
                });
            lunge.start();
        }
    },

    resumeMovement() {
        this.walkTween.start();

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
});