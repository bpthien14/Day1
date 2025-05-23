cc.Class({
    extends: cc.Component,
    properties: {
        popupSetting: require('popupItem'),
    },
    showSetting() {
        this.popupSetting.show();
    },
    // showRank() {
    //     this.popupRank.show();
    // },
    hideSetting() {
        this.popupSetting.hide();
    },
    // hideRank() {
    //     this.popupRank.hide();
    // },
})