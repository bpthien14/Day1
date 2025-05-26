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
        bgmVolumeSlider: {
            type: cc.Slider,
            default: null,
        },
        sfxVolumeSlider: {
            type: cc.Slider,
            default: null,
        },
        bgmVolumeLabel: {
            type: cc.Label,
            default: null
        },
        sfxVolumeLabel: {
            type: cc.Label,
            default: null
        }
    },

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        
        this.loadVolumeSettings();
                
        this.playBGM();
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

    onBGMVolumeChanged(slider) {
        this.bgmVolume = slider.progress;
        cc.audioEngine.setMusicVolume(this.bgmVolume);
        this.updateBGMVolumeLabel();
        this.saveVolumeSettings();
    },

    onSFXVolumeChanged(slider) {
        this.sfxVolume = slider.progress;
        this.updateSFXVolumeLabel();
        this.saveVolumeSettings();
        
        // this.playTestSFX();
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

    updateBGMVolumeLabel() {
        if (this.bgmVolumeLabel) {
            this.bgmVolumeLabel.string = Math.round(this.bgmVolume * 100) + '%';
        }
    },

    updateSFXVolumeLabel() {
        if (this.sfxVolumeLabel) {
            this.sfxVolumeLabel.string = Math.round(this.sfxVolume * 100) + '%';
        }
    },

    playBGM() {
        this.idBGM = cc.audioEngine.playMusic(this.audioSourceBGM, true);
        cc.audioEngine.setMusicVolume(this.bgmVolume);
    },

    playClick() {
        cc.audioEngine.play(this.audioSourceClick, false, this.sfxVolume);
    },

    playSFX(audioClip, loop = false) {
        return cc.audioEngine.play(audioClip, loop, this.sfxVolume);
    },

    start() {
        this.updateBGMVolumeLabel();
        this.updateSFXVolumeLabel();
    }
});

