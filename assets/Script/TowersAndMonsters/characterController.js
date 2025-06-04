cc.Class({
    extends: cc.Component,

    properties: {
        monsterPrefab: {
            default: null,
            type: cc.Prefab,
        },
        spawnPoints: {
            default: [],
            type: [cc.Node], 
        },
        spawnInterval: 2.0,
        maxMonsters: 100,
    },

    onLoad() {
        this.monsterList = [];
        if (this.spawnPoints.length === 0) {
            cc.warn("Chưa thiết lập các điểm sinh quái (spawnPoints)!");
            return;
        }

        this.startSpawning();
    },

    startSpawning() {
        this.schedule(this.spawnMonster, this.spawnInterval);
    },
    
    stopSpawning() {
        this.unschedule(this.spawnMonster);
    },

    spawnMonster() {
        if (this.monsterList.length >= this.maxMonsters) {
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.spawnPoints.length);
        const spawnPoint = this.spawnPoints[randomIndex];

        let newMonster = cc.instantiate(this.monsterPrefab);
        newMonster.parent = this.node;
        
        const worldPos = spawnPoint.convertToWorldSpaceAR(cc.v2(0, 0));
        const nodePos = this.node.convertToNodeSpaceAR(worldPos);
        newMonster.setPosition(nodePos);

        const monsterComponent = newMonster.getComponent('greenDog');
        if (monsterComponent) {
            monsterComponent.init(this);
        }

        this.monsterList.push(newMonster);
    },

    onMonsterKilled(monsterNode) {
        const index = this.monsterList.indexOf(monsterNode);
        if (index !== -1) {
            this.monsterList.splice(index, 1);
        }
    },
});