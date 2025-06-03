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
            default: 1600
        },
        bulletController: {
            default: null,
            type: cc.Node,
        },
        debugDraw: {    
            default: false,
        },
        firePoint : {
            default: null,
            type: cc.Node,
        }
    },

    onLoad() {
        this._super();
        
        this._targetMonster = null;
        this.canFire = true;
        
        this.monsterController = null;

        if (this.debugDraw) {
            this.drawNode = new cc.Node("RangeCircle");
            this.drawNode.parent = this.node;
            let graphics = this.drawNode.addComponent(cc.Graphics);
            graphics.circle(0, 0, this.range);
            graphics.stroke();
        }
        
        this.firePoint.parent = this.node;

        this.schedule(this.findNewTarget, 0.3);
    },

    start() {
        const monsterControllerNode = cc.find('Canvas/MonsterController');
        if (monsterControllerNode) {
            this.monsterController = monsterControllerNode.getComponent('characterController');
        }
    },

    get targetMonster() {
        return this._targetMonster;
    },

    set targetMonster(monster) {
        this._targetMonster = monster;
    },

    init(controller) {
        this.controller = controller;
    },

    update(dt) {
        if (this.shouldFindNewTarget()) {
            this.findNewTarget();
        }

        if (this.canFire && this.targetMonster) {
            this.fire();
        }
    },

    shouldFindNewTarget() {
        if (!this.targetMonster || !this.targetMonster.isValid) return true;
        
        const monsterComponent = this.targetMonster.getComponent('greenDog');
        if (!monsterComponent || monsterComponent.currentHp <= 0) return true;

        if (!this.isInRange(this.targetMonster)) return true;

        return false;
    },

    findNewTarget() {
        if (!this.monsterController) return;
        
        const monsters = this.monsterController.monsterList;
        let nearestDistance = Infinity;
        let nearestMonster = null;

        for (let monster of monsters) {
            if (!monster || !monster.isValid) continue;
            
            const monsterComponent = monster.getComponent('greenDog');
            if (!monsterComponent || monsterComponent.currentHp <= 0) continue;

            const distance = this.getDistanceToMonster(monster);
            
            if (distance <= this.range && distance < nearestDistance) {
                nearestDistance = distance;
                nearestMonster = monster;
            }
        }

        this.targetMonster = nearestMonster;
    },

    getDistanceToMonster(monster) {
        if (!monster || !monster.isValid) return Infinity;

        const turretWorldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        const monsterWorldPos = monster.parent.convertToWorldSpaceAR(monster.position);
        
        return turretWorldPos.sub(monsterWorldPos).mag();
    },

    isInRange(monster) {
        return this.getDistanceToMonster(monster) <= this.range;
    },

    fire() {
        if (!this.bulletController || !this.targetMonster) return;

        this.canFire = false;
        const bulletCtrl = this.bulletController.getComponent('bulletController');
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