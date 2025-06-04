cc.Class({
    extends: cc.Component,

    properties: {
        lifeTime: {
            default: 5,
        }
    },

    init(direction, speed, damage, controller) {
        this.direction = direction;
        this.speed = speed;
        this.damage = damage;
        this.controller = controller;
        this.lifeTimer = 0;
        this.node.active = true;

        const canvas = cc.find("Canvas");
        if (canvas) {
            this.damageTextManager = canvas.getComponent("damageTextManager");
        }
    },

    update(dt) {
        if (!this.direction) return;

        const movement = this.direction.mul(this.speed * dt);
        this.node.x += movement.x;
        this.node.y += movement.y;

        this.lifeTimer += dt;
        if (this.lifeTimer >= this.lifeTime) {
            this.recycleSelf();
        }

        const screenPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        if (screenPos.x < -100 || screenPos.x > cc.winSize.width + 100 ||
            screenPos.y < -100 || screenPos.y > cc.winSize.height + 100) {
            this.recycleSelf();
        }
    },

    onCollisionEnter(other, self) {
        if (other.node.group === 'GreenDog') {
            const monster = other.node.getComponent('greenDog');
            if (monster) {
                if (this.damageTextManager) {
                    const hitPos = other.node.convertToWorldSpaceAR(cc.v2(0, 30));
                    this.damageTextManager.showDamageText(hitPos, this.damage);
                }
                
                monster.takeDamage(this.damage);
                this.recycleSelf();
            }
        }
    },

    recycleSelf() {
        if (this.controller) {
            this.node.active = false; 
            this.controller.recycleBullet(this.node);
        }
    }
});