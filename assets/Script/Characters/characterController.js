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
        spawnInterval: 4.0,
        maxMonsters: 10,
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
        if (this.monsterList.length > this.maxMonsters) {
            this.stopSpawning();
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.spawnPoints.length);
        const spawnPoint = this.spawnPoints[randomIndex];

        let newMonster = cc.instantiate(this.monsterPrefab);

        newMonster.setPosition(0,0);
        
        newMonster.parent = this.spawnPoints[randomIndex];

        this.monsterList.push(newMonster);
        newMonster.getComponent('characterItem').init(this);

    },

    onMonsterKilled(monsterNode) {
        const index = this.monsterList.indexOf(monsterNode);
        if (index !== -1) {
            this.monsterList.splice(index, 1);
        }
    },
});