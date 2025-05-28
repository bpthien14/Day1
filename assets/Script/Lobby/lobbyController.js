const mEmitter = require('mEmitter');
const { SOUND_EVENTS } = require('../Event/constants');

cc.Class({
    extends: cc.Component,

    onButtonClick(event, data){
        mEmitter.instance.emit('BUTTON_CLICKED', data);
        mEmitter.instance.emit(SOUND_EVENTS.PLAY_SFX, 'click');
    }
})