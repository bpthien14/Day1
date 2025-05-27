const mEmitter = require('mEmitter');
const { SOUND_EVENTS } = require('Event/constants');

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
    },

    onLoad() {
        if (!mEmitter.instance) {
            mEmitter.instance = new mEmitter();
        }
        
        this.loadVolumeSettings();

        this.registerEvents();
                
        this.playBGM();
    },
    
    registerEvents() {
        mEmitter.instance.registerEvent(SOUND_EVENTS.BGM_VOLUME_CHANGED, this.setBGMVolume.bind(this));
        mEmitter.instance.registerEvent(SOUND_EVENTS.SFX_VOLUME_CHANGED, this.setSFXVolume.bind(this));
        mEmitter.instance.registerEvent(SOUND_EVENTS.PLAY_SFX, this.playTestSFX.bind(this));
    },

    loadVolumeSettings() {
        try {
            const savedBgmVolume = cc.sys.localStorage.getItem("bgm_volume");
            const savedSfxVolume = cc.sys.localStorage.getItem("sfx_volume");
            
            this.bgmVolume = savedBgmVolume !== null ? parseFloat(savedBgmVolume) : 0.7;
            this.sfxVolume = savedSfxVolume !== null ? parseFloat(savedSfxVolume) : 0.8;
        } catch (e) {
            console.error("Error loading volume settings:", e);
            this.bgmVolume = 0.7;
            this.sfxVolume = 0.8;
        }
    },

    setBGMVolume(volume) {
        this.bgmVolume = volume;
        cc.audioEngine.setMusicVolume(this.bgmVolume);
        this.saveVolumeSettings();
        
        mEmitter.instance.emit('VOLUME_DATA_CHANGED', {
            type: 'bgm',
            volume: this.bgmVolume
        });
        
        console.log(`BGM volume changed to: ${Math.round(this.bgmVolume * 100)}%`);
    },

    setSFXVolume(volume) {
        this.sfxVolume = volume;
        this.saveVolumeSettings();
        
        mEmitter.instance.emit('VOLUME_DATA_CHANGED', {
            type: 'sfx',
            volume: this.sfxVolume
        });
        
        console.log(`SFX volume changed to: ${Math.round(this.sfxVolume * 100)}%`);
    },

    playTestSFX() {
        if (this.audioSourceClick) {
            cc.audioEngine.play(this.audioSourceClick, false, this.sfxVolume);
        }
    },

    saveVolumeSettings() {
        try {
            cc.sys.localStorage.setItem("bgm_volume", this.bgmVolume.toString());
            cc.sys.localStorage.setItem("sfx_volume", this.sfxVolume.toString());
        } catch (e) {
            console.error("Error saving volume settings:", e);
        }
    },

    playBGM() {
        this.idBGM = cc.audioEngine.playMusic(this.audioSourceBGM, true);
        cc.audioEngine.setMusicVolume(this.bgmVolume);
    },

    playSFX(audioClip, loop = false) {
        return cc.audioEngine.play(audioClip, loop, this.sfxVolume);
    },
    
    onDestroy() {
        mEmitter.instance.removeEvent(SOUND_EVENTS.BGM_VOLUME_CHANGED, this.setBGMVolume);
        mEmitter.instance.removeEvent(SOUND_EVENTS.SFX_VOLUME_CHANGED, this.setSFXVolume);
        mEmitter.instance.removeEvent(SOUND_EVENTS.PLAY_SFX, this.playTestSFX);
    }
});



