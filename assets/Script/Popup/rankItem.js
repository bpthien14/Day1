cc.Class({
    extends: cc.Component,

    properties: {
        rankLabel: {
            default: null,
            type: cc.Label,
            tooltip: "Label hiển thị thứ hạng"
        },
        playerNameLabel: {
            default: null,
            type: cc.Label,
            tooltip: "Label hiển thị tên người chơi"
        },
        scoreLabel: {
            default: null,
            type: cc.Label,
            tooltip: "Label hiển thị điểm số"
        },
        levelLabel: {
            default: null,
            type: cc.Label,
            tooltip: "Label hiển thị level"
        },
        avatarSprite: {
            default: null,
            type: cc.Sprite,
            tooltip: "Sprite hiển thị avatar"
        },
        backgroundNormal: {
            default: null,
            type: cc.SpriteFrame,
            tooltip: "Background cho người chơi thường"
        },
        backgroundHighlight: {
            default: null,
            type: cc.SpriteFrame,
            tooltip: "Background cho người chơi hiện tại"
        },
        backgroundSprite: {
            default: null,
            type: cc.Sprite,
            tooltip: "Sprite background của item"
        },
        crownIcon: {
            default: null,
            type: cc.Node,
            tooltip: "Icon vương miện cho top 3"
        }
    },

    updateData(rankInfo) {
        if (!rankInfo) return;

        this.updateRank(rankInfo.rank);

        if (this.playerNameLabel) {
            this.playerNameLabel.string = rankInfo.playerName;
        }

        if (this.scoreLabel) {
            this.scoreLabel.string = this.formatScore(rankInfo.score);
        }

        if (this.levelLabel) {
            this.levelLabel.string = "Lv." + rankInfo.level;
        }

        this.updateBackground(rankInfo.isCurrentPlayer);

        this.updateCrown(rankInfo.rank);

        this.loadAvatar(rankInfo.avatar);
    },

    updateRank(rank) {
        if (this.rankLabel) {
            this.rankLabel.string = "#" + rank;
            
            if (rank === 1) {
                this.rankLabel.node.color = cc.Color.YELLOW; 
            } else if (rank === 2) {
                this.rankLabel.node.color = cc.Color.WHITE; 
            } else if (rank === 3) {
                this.rankLabel.node.color = new cc.Color(205, 127, 50); 
            } else {
                this.rankLabel.node.color = cc.Color.BLACK;
            }
        }
    },

    formatScore(score) {
        return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    updateBackground(isCurrentPlayer) {
        if (!this.backgroundSprite) return;

        if (isCurrentPlayer && this.backgroundHighlight) {
            this.backgroundSprite.spriteFrame = this.backgroundHighlight;
        } else if (this.backgroundNormal) {
            this.backgroundSprite.spriteFrame = this.backgroundNormal;
        }
    },

    updateCrown(rank) {
        if (!this.crownIcon) return;

        this.crownIcon.active = rank <= 3;
        
        if (rank <= 3) {
            let crownSprite = this.crownIcon.getComponent(cc.Sprite);
            if (crownSprite) {
                if (rank === 1) {
                    crownSprite.node.color = cc.Color.YELLOW;
                } else if (rank === 2) {
                    crownSprite.node.color = cc.Color.WHITE;
                } else if (rank === 3) {
                    crownSprite.node.color = new cc.Color(205, 127, 50);
                }
            }
        }
    },

    loadAvatar(avatarName) {
        if (!this.avatarSprite || !avatarName) return;

        cc.resources.load("avatars/" + avatarName, cc.SpriteFrame, (err, spriteFrame) => {
            if (!err && spriteFrame && this.avatarSprite) {
                this.avatarSprite.spriteFrame = spriteFrame;
            } else {
                console.log("Avatar not found:", avatarName);
                this.loadDefaultAvatar();
            }
        });
    },

    loadDefaultAvatar() {
        cc.resources.load("avatars/default_avatar", cc.SpriteFrame, (err, spriteFrame) => {
            if (!err && spriteFrame && this.avatarSprite) {
                this.avatarSprite.spriteFrame = spriteFrame;
            }
        });
    }
});