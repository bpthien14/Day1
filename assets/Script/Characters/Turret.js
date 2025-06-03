const TowerItem = require('./towerItem');

cc.Class({
    extends: TowerItem,

    properties: {
        bulletPrefab: {
            default: null,
            type: cc.Prefab,
        },
        fireRate: {
            default: 1,
        },
        range: {
            default: 300,
        },
        bulletController: {
            default: null,
            type: cc.Node,
        }
    },

    onLoad() {
        this._super();
        this.targetMonster = null;
        this.canFire = true;
        
        this.firePoint = new cc.Node("FirePoint");
        this.firePoint.parent = this.node;
        this.firePoint.setPosition(20, 0); 
    },

    init(controller) {
        this.controller = controller;
    },

    update(dt) {
        if (this.targetMonster && (!this.targetMonster.isValid || !this.isInRange(this.targetMonster))) {
            this.targetMonster = null;
        }

        if (!this.targetMonster) {
            this.findNewTarget();
        }

        if (this.canFire && this.targetMonster) {
            this.fire();
        }
    },

    findNewTarget() {
        const monsters = cc.find('Canvas/MonsterController').getComponent('characterController').monsterList;
        let nearestDistance = this.range;
        let nearestMonster = null;

        for (let monster of monsters) {
            if (!monster.isValid) continue;
            const distance = this.node.position.sub(monster.position).mag();
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestMonster = monster;
            }
        }

        this.targetMonster = nearestMonster;
    },

    isInRange(monster) {
        return this.node.position.sub(monster.position).mag() <= this.range;
    },

    fire() {
        if (!this.bulletController || !this.targetMonster) return;

        this.canFire = false;
        const bulletCtrl = this.bulletController.getComponent('BulletController');
        if (bulletCtrl) {
            const worldFirePos = this.firePoint.convertToWorldSpaceAR(cc.v2(0, 0));
            const targetWorldPos = this.targetMonster.convertToWorldSpaceAR(cc.v2(0, 0));
            
            const startPos = this.bulletController.convertToNodeSpaceAR(worldFirePos);
            const targetPos = this.bulletController.convertToNodeSpaceAR(targetWorldPos);
            
            bulletCtrl.spawnBullet(startPos, targetPos);
        }

        this.scheduleOnce(() => {
            this.canFire = true;
        }, this.fireRate);
    }
});