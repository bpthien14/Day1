cc.Class({
    extends: cc.Component,

    properties: {
        bulletPrefab: {
            default: null,
            type: cc.Prefab,
        },
        poolSize: {
            default: 20,
        },
        bulletSpeed: {
            default: 500,
        },
        bulletDamage: {
            default: 400,
        }
    },

    onLoad() {
        this._initPool();
    },

    _initPool() {
        this.bulletPool = new cc.NodePool();
        for (let i = 0; i < this.poolSize; i++) {
            let bullet = cc.instantiate(this.bulletPrefab);
            this.bulletPool.put(bullet);
        }
    },

    spawnBullet(startPos, targetPos) {
        let bullet = null;
        if (this.bulletPool.size() > 0) {
            bullet = this.bulletPool.get();
        } else {
            bullet = cc.instantiate(this.bulletPrefab);
        }

        bullet.parent = this.node;
        bullet.position = startPos;
        
        const direction = targetPos.sub(startPos).normalize();
        
        const angle = Math.atan2(direction.y, direction.x) * 180 / Math.PI;
        bullet.angle = -angle; 
        
        const bulletComponent = bullet.getComponent('Bullet');
        if (bulletComponent) {
            bulletComponent.init(direction, this.bulletSpeed, this.bulletDamage, this);
        }
    },

    recycleBullet(bullet) {
        this.bulletPool.put(bullet);
    },

    onDestroy() {
        this.bulletPool.clear();
    }
});