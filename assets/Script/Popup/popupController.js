const mEmitter = require('mEmitter');

cc.Class({
    extends: cc.Component,
    
    properties: {
        popupSetting: {
            default: null,
            type: cc.Node,
        },
        popupRank: {
            default: null,
            type: cc.Node,
        },
    },
    
    onLoad() {

        console.log(mEmitter.instance);
        mEmitter.instance.registerEvent('BUTTON_CLICKED', this.showPopup.bind(this));
    },
    
    showPopup(name) {
        if (name === 'SETTING') {
            this.popupSetting.getComponent('popupSetting').show();
            
        }
        if (name === 'RANKING') {
            this.popupRank.getComponent('popupRank').show();
        }
    },

});
