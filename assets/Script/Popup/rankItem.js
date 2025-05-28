const _avatarCache = {};

cc.Class({
    extends: cc.Component,

    properties: {
        rankLabel: cc.Label,
        playerNameLabel: cc.Label,
        scoreLabel: cc.Label,
        levelLabel: cc.Label,
        avatarSprite: cc.Sprite,
        crownIcon: cc.Node,
    },

    onLoad() {
        this._currentAvatarUrl = null;
    },

    updateData(rankInfo) {
        if (!rankInfo) {
            console.error("rankInfo is null or undefined!");
            return;
        }

        this.rankLabel.string = "#" + rankInfo.rank;
        this.playerNameLabel.string = rankInfo.playerName;
        this.scoreLabel.string = this.formatScore(rankInfo.score);
        this.levelLabel.string = "Lv." + rankInfo.level;

        const rankColor = this._getTopRankColor(rankInfo.rank);
        this._setTopRankColor(rankColor);
        

        this.updateCrown(rankInfo.rank, rankColor);

        this.loadAvatar(rankInfo.avatar);
    },

    _getTopRankColor(rank) {
        if (rank === 1) return cc.Color.YELLOW;
        if (rank === 2) return new cc.Color(186, 219, 243); 
        if (rank === 3) return new cc.Color(205, 127, 50); 
        return cc.Color.WHITE;
    },

    _setTopRankColor(color) {
        this.rankLabel.node.color = color;
        this.playerNameLabel.node.color = color;
        this.scoreLabel.node.color = color;
        this.levelLabel.node.color = color;
    },

    formatScore(score) {
        if (typeof score !== 'number') return "0";
        return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    updateCrown(rank, color) {
        if (!this.crownIcon) return;
        this.crownIcon.active = rank <= 3;
        
        if (this.crownIcon.active) {
            this.crownIcon.color = color;
        }
    },
    
    loadAvatar(avatarUrl) {
        if (!this.avatarSprite) {
            console.warn("Avatar sprite component is not assigned!");
            return;
        }

        const finalUrl = avatarUrl || "https://avatar.iran.liara.run/public/boy?username=default";

        if (this._currentAvatarUrl === finalUrl) return;
        this._currentAvatarUrl = finalUrl;

        if (_avatarCache[finalUrl]) {
            this.avatarSprite.spriteFrame = _avatarCache[finalUrl];
            console.log(`Lấy avatar từ cache: ${finalUrl}`);
            this.adjustAvatarSize();
            return;
        }

        this.setAvatarLoadingState(true);
        cc.loader.load({ url: finalUrl, type: 'png' }, (err, texture) => {
            if (!this.node || !this.node.isValid) return;

            this.setAvatarLoadingState(false);

            if (err) {
                console.error(`Lỗi khi tải avatar từ URL: ${finalUrl}`, err.message);
                if (finalUrl.includes("username=default")) {
                    this.avatarSprite.spriteFrame = null; 
                } else {
                    this.loadAvatar(null); 
                }
                return;
            }

            const spriteFrame = new cc.SpriteFrame(texture);
            
            _avatarCache[finalUrl] = spriteFrame; 
            
            this.avatarSprite.spriteFrame = spriteFrame;
            this.adjustAvatarSize();
            console.log(`Đã tải và cache avatar thành công: ${finalUrl}`);
        });
    },

    adjustAvatarSize() {
        if (!this.avatarSprite || !this.avatarSprite.node) return;
        
        const avatarNode = this.avatarSprite.node;
        const targetSize = 50;
        avatarNode.width = targetSize;
        avatarNode.height = targetSize;
        
        this.avatarSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        this.avatarSprite.type = cc.Sprite.Type.SIMPLE;
        
        const mask = avatarNode.getComponent(cc.Mask);
        if (mask) {
            mask.type = cc.Mask.Type.ELLIPSE;
            mask.segements = 32; 
        }
    },
    
    onLoad() {
        this._currentAvatarName = null;
    },
    
    setAvatarLoadingState(isLoading) {
        if (!this.avatarSprite || !this.avatarSprite.isValid) return;
        this.avatarSprite.node.opacity = isLoading ? 120 : 255;
    },
});