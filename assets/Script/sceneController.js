cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    loadScene(sceneName) {
        cc.director.loadScene(sceneName);
    },

});