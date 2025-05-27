const mEmitter = require('mEmitter');
const { SOUND_EVENTS } = require('Event/constants');

cc.Class({
    extends: require('popupItem'),
    properties: {
        bgmVolumeSlider: cc.Slider,
        sfxVolumeSlider: cc.Slider,
        bgmVolumeIconOn: {
            type: cc.Sprite,
            default: null
        },
        bgmVolumeIconOff: {
            type: cc.Sprite,
            default: null
        },
        sfxVolumeIconOn: {
            type: cc.Sprite,
            default: null
        },
        sfxVolumeIconOff: {
            type: cc.Sprite,
            default: null
        }
    },
    
    onLoad() {
        this._super();
        
        if (!mEmitter.instance) {
            mEmitter.instance = new mEmitter();
        }
        
        this.bgmVolumeSlider.node.on('slide', this.onBGMSliderChanged, this);
        this.sfxVolumeSlider.node.on('slide', this.onSFXSliderChanged, this);
        
        mEmitter.instance.registerEvent('VOLUME_DATA_CHANGED', this.onVolumeDataChanged.bind(this));
    },
    
    onDestroy() {
        if (mEmitter.instance) {
            mEmitter.instance.removeEvent('VOLUME_DATA_CHANGED', this.onVolumeDataChanged.bind(this));
        }
    },
    
    show() {
        this._super();
        this.loadVolumeSettings();
    },
    
    loadVolumeSettings() {
        try {
            const savedBgmVolume = cc.sys.localStorage.getItem("bgm_volume");
            const savedSfxVolume = cc.sys.localStorage.getItem("sfx_volume");
            
            const bgmVolume = savedBgmVolume !== null ? parseFloat(savedBgmVolume) : 0.7;
            const sfxVolume = savedSfxVolume !== null ? parseFloat(savedSfxVolume) : 0.8;
            
            if (this.bgmVolumeSlider) {
                this.bgmVolumeSlider.progress = bgmVolume;
                this.updateBGMVolumeIcon();
            }
            
            if (this.sfxVolumeSlider) {
                this.sfxVolumeSlider.progress = sfxVolume;
                this.updateSFXVolumeIcon();
            }
        } catch (e) {
            console.error("Lỗi khi load thiết lập âm lượng:", e);
        }
    },
    
    onBGMSliderChanged(slider) {
        if (!this.bgmVolumeSlider) return;
        
        this.updateBGMVolumeIcon();
        this.saveVolumeSettings();
        
        mEmitter.instance.emit(SOUND_EVENTS.BGM_VOLUME_CHANGED, this.bgmVolumeSlider.progress);
    },
    
    onSFXSliderChanged(slider) {
        if (!this.sfxVolumeSlider) return;
        
        this.updateSFXVolumeIcon();
        this.saveVolumeSettings();
        
        mEmitter.instance.emit(SOUND_EVENTS.SFX_VOLUME_CHANGED, this.sfxVolumeSlider.progress);
        
        // mEmitter.instance.emit(SOUND_EVENTS.PLAY_SFX);
    },
    
    onVolumeDataChanged(data) {
        if (!data || !this.node || !this.node.isValid) return;
        
        if (data.type === 'bgm' && this.bgmVolumeSlider) {
            const currentProgress = this.bgmVolumeSlider.progress;
            if (currentProgress !== data.volume) {
                this.bgmVolumeSlider.progress = data.volume;
                this.updateBGMVolumeIcon();
            }
        } else if (data.type === 'sfx' && this.sfxVolumeSlider) {
            const currentProgress = this.sfxVolumeSlider.progress;
            if (currentProgress !== data.volume) {
                this.sfxVolumeSlider.progress = data.volume;
                this.updateSFXVolumeIcon();
            }
        }
    },
    
    updateBGMVolumeIcon() {
        if (!this.bgmVolumeSlider || !this.bgmVolumeIconOn || !this.bgmVolumeIconOff) return;
        
        const isOn = this.bgmVolumeSlider.progress > 0.001;
        if (this.bgmVolumeIconOn.node) {
            this.bgmVolumeIconOn.node.active = isOn;
        }
        if (this.bgmVolumeIconOff.node) {
            this.bgmVolumeIconOff.node.active = !isOn;
        }
    },
    
    updateSFXVolumeIcon() {
        if (!this.sfxVolumeSlider || !this.sfxVolumeIconOn || !this.sfxVolumeIconOff) return;
        
        const isOn = this.sfxVolumeSlider.progress > 0.001;
        if (this.sfxVolumeIconOn.node) {
            this.sfxVolumeIconOn.node.active = isOn;
        }
        if (this.sfxVolumeIconOff.node) {
            this.sfxVolumeIconOff.node.active = !isOn;
        }
    },
    
    saveVolumeSettings() {
        if (!this.bgmVolumeSlider || !this.sfxVolumeSlider) return;
        
        try {
            cc.sys.localStorage.setItem("bgm_volume", this.bgmVolumeSlider.progress.toString());
            cc.sys.localStorage.setItem("sfx_volume", this.sfxVolumeSlider.progress.toString());
        } catch (e) {
            console.error("Lỗi khi lưu thiết lập âm lượng:", e);
        }
    },
    
    onResetButtonClicked() {
        if (!this.bgmVolumeSlider || !this.sfxVolumeSlider) return;
        
        this.bgmVolumeSlider.progress = 0.7;
        this.sfxVolumeSlider.progress = 0.8;
        
        this.updateBGMVolumeIcon();
        this.updateSFXVolumeIcon();
        
        this.saveVolumeSettings();
        
        mEmitter.instance.emit(SOUND_EVENTS.BGM_VOLUME_CHANGED, this.bgmVolumeSlider.progress);
        mEmitter.instance.emit(SOUND_EVENTS.SFX_VOLUME_CHANGED, this.sfxVolumeSlider.progress);
    }
});