cc.Class({
    extends: cc.Component,

    properties: {
        turretPrefab: {
            default: null,
            type: cc.Prefab,
        },
        spawnPoints: {
            default: [],
            type: [cc.Node],
        }
    },

    onLoad() {
        this.turrets = [];
    },

    spawnTurret(position) {
        let newTurret = cc.instantiate(this.turretPrefab);
        newTurret.parent = this.node;
        newTurret.position = position;

        const turretComponent = newTurret.getComponent('Turret');
        if (turretComponent) {
            turretComponent.init(this);
            this.turrets.push(newTurret);
        }
        return newTurret;
    },

    removeTurret(turret) {
        const index = this.turrets.indexOf(turret);
        if (index !== -1) {
            this.turrets.splice(index, 1);
        }
    }
});