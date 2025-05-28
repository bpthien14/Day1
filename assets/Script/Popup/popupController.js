const mEmitter = require('mEmitter');
const { SHOW_EVENTS } = require('../Event/constants');

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
        mEmitter.instance.registerEvent(SHOW_EVENTS.SHOW_POPUP, this.showPopup.bind(this));
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
