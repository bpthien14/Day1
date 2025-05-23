cc.Class({
    extends: require('popupItem'),
    properties: {
        bgmVolumeSlider: cc.Slider,
        sfxVolumeSlider: cc.Slider,
        bgmToggle: cc.Toggle,
        sfxToggle: cc.Toggle,
        vibrationToggle: cc.Toggle,
        languageDropdown: cc.DropDown,
        bgmValueLabel: cc.Label,
        sfxValueLabel: cc.Label,
    },
    
})