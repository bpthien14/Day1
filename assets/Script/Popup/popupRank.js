cc.Class({
    extends: require("popupItem"),

    properties: {
        cellPrefab: {
            default: null,
            type: cc.Prefab,
        },
        layout: {
            default: null,
            type: cc.Node,
        },
        scrollView: {
            default: null,
            type: cc.ScrollView,
        },
        rankData: {
            default: null,
            type: cc.JsonAsset,
        }
    },

    onLoad() {
        this._super();
        this.rankList = [];
    },

    show() {
        this._super();
        this.loadRankData();
    },

    hide() {
        this._super();
        this.clearRankItems();
    },

    loadRankData() {
        if (!this.rankData) {
            console.error("Rank data not found!");
            return;
        }

        try {
            const data = this.rankData.json;
            if (data && data.rankings) {
                this.createRankItems(data.rankings);
            } else {
                console.error("Invalid rank data format!");
            }
        } catch (error) {
            console.error("Error parsing rank data:", error);
        }
    },

    createRankItems(rankings) {
        this.clearRankItems();

        rankings.forEach((rankInfo, index) => {
            this.createRankItem(rankInfo, index);
        });

        this.updateScrollViewContent();
    },

    createRankItem(rankInfo, index) {
        if (!this.cellPrefab) {
            console.error("Cell prefab not assigned!");
            return;
        }

        if (!this.layout) {
            console.error("Layout not assigned!");
            return;
        }

        let cell = cc.instantiate(this.cellPrefab);
        cell.parent = this.layout;
        
        let itemScript = cell.getComponent('rankItem');
        if (itemScript) {
            itemScript.updateData(rankInfo);
        } else {
            console.error("rankItem script not found on prefab!");
        }

        this.rankList.push(cell);
    },

    clearRankItems() {
        if (!this.rankList) {
            this.rankList = [];
            return;
        }
        
        this.rankList.forEach(item => {
            if (item && item.isValid) {
                item.destroy();
            }
        });
        this.rankList = [];
    },

    updateScrollViewContent() {
        if (this.scrollView && this.layout) {
            let layoutComponent = this.layout.getComponent(cc.Layout);
            if (layoutComponent) {
                layoutComponent.updateLayout();
            }
        }
    },

    onDestroy() {
        this.clearRankItems();
    }
});
