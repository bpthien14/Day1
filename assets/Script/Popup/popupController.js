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
        this.hideAllPopups();
        
    },
    
    showSetting() {
        this.hideRank();
        
        if (this.popupSetting) {
            let settingScript = this.popupSetting.getComponent('popupSetting');
            if (settingScript) {
                settingScript.show();
            } else {
                console.error("popupSetting script not found!");
            }
        } else {
            console.error("popupSetting node not assigned!");
        }
    },
    
    showRank() {
        this.hideSetting();
        
        if (this.popupRank) {
            let rankScript = this.popupRank.getComponent('popupRank');
            if (rankScript) {
                rankScript.show();
            } else {
                console.error("popupRank script not found!");
            }
        } else {
            console.error("popupRank node not assigned!");
        }
    },
    
    hideSetting() {
        if (this.popupSetting) {
            let settingScript = this.popupSetting.getComponent('popupSetting');
            if (settingScript) {
                settingScript.hide();
            }
        }
    },
    
    hideRank() {
        if (this.popupRank) {
            let rankScript = this.popupRank.getComponent('popupRank');
            if (rankScript) {
                rankScript.hide();
            }
        }
    },
    
    hideAllPopups() {
        this.hideSetting();
        this.hideRank();
    },
    
});
