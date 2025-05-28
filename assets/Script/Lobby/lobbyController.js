const mEmitter = require('mEmitter');
const { SOUND_EVENTS, SHOW_EVENTS } = require('../Event/constants');

cc.Class({
    extends: cc.Component,

    onButtonClick(event, data){
        mEmitter.instance.emit(SHOW_EVENTS.SHOW_POPUP, data);
        mEmitter.instance.emit(SOUND_EVENTS.PLAY_SFX, 'click');
    }
})