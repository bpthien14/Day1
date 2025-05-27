cc.Class({
    extends: require("popupItem"),

    properties: {
        cellPrefab: cc.Prefab,
        layout: cc.Node,
        scrollView: cc.ScrollView,
        rankData: cc.JsonAsset,
    },

    onLoad() {
        this._super();
        this.rankList = [];
        this._isDataLoaded = false;

        this.initPool(20);
    },
    
    initPool(poolSize) {
        if (!this.cellPrefab) {
            console.error("Chưa gán Prefab (cellPrefab) trong Editor!");
            return;
        }
        for (let i = 0; i < poolSize; i++) {
            let cellNode = cc.instantiate(this.cellPrefab);
            cellNode.active = false; 
            this.layout.addChild(cellNode);
            this.rankList.push(cellNode);
        }
    },

    show() {
        this._super();
        if (!this._isDataLoaded) {
            this.loadRankData();
            this._isDataLoaded = true;
        }
        this.scrollView.scrollToTop(0);
    },

    loadRankData() {
        if (!this.rankData || !this.rankData.json) {
            return;
        }

        const data = this.rankData.json;
        if (!data || !Array.isArray(data.rankings)) {
            return;
        }
        
        this.renderRankings(data.rankings);
    },

    renderRankings(rankingsData) {
        const totalDataItems = rankingsData.length;

        for (let i = 0; i < this.rankList.length; i++) {
            const cellNode = this.rankList[i];
            
            if (i < totalDataItems) {
                const rankInfo = rankingsData[i];
                const itemScript = cellNode.getComponent('rankItem');
                if (itemScript) {
                    itemScript.updateData(rankInfo);
                }
                cellNode.active = true; 
            } else {
                cellNode.active = false;
            }
        }
        
        this.scheduleOnce(() => {
            if (this.layout && this.layout.isValid) {
                const layoutComponent = this.layout.getComponent(cc.Layout);
                if (layoutComponent) {
                    layoutComponent.updateLayout();
                }
            }
        }, 0);
    },

    onDestroy() {
        this.rankList = [];
    }
});