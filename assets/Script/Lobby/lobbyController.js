cc.Class({
    extends: cc.Component,
    properties:{
        popupController: {
            default: null,
            type: require('popupController')
        },
    },

    showSetting() {
        this.popupController.showSetting();
    },  
    showRank() {
        this.popupController.showRank();
    },
    hideSetting() {
        this.popupController.hideSetting();
    },
    hideRank() {
        this.popupController.hideRank();
    },
    onLoad() {
        this.popupController.hideSetting();
        this.popupController.hideRank();
    },
})