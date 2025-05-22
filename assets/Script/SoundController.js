// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        audioSourceBGM: {
            type: cc.AudioClip,
            default: null
        },
        audioSourceClick: {
            type: cc.AudioClip,
            default: null
        },
        labelVolume: {
            type: cc.Label,
            default: null
        },
    },

    playBGM() {
        console.log("playBGM");
        this.idBGM = cc.audioEngine.playMusic(this.audioSourceBGM, true);
    },

    onLoad () {
        this.playBGM();
    },

    playClick() {
        console.log("playClick");
        cc.audioEngine.play(this.audioSourceClick, false, 1);
    },

    start () {
        this.currentVol = 1;
    },

    increaseVolume() {
        let volume = this.currentVol;
        this.currentVol = parseFloat(Math.min(volume + 0.1, 1.0));
        cc.audioEngine.setVolume(this.idBGM, volume.toFixed(1));
        console.log('🔊 Tăng âm lượng:', volume.toFixed(1));
    },

    decreaseVolume() {
        let volume = this.currentVol;
        this.currentVol = parseFloat(Math.max(volume - 0.1, 0.0));
        cc.audioEngine.setVolume(this.idBGM, volume.toFixed(1));
        console.log('🔉 Giảm âm lượng:', volume.toFixed(1));
    },
    updateVolumeLabel() {
        if (this.labelVolume) {
            this.labelVolume.string = 'Âm lượng: ' + Math.round(this.currentVol * 100) + '%';
        }
    
    },
    update(dt) {
        this.updateVolumeLabel();
    }

    });
