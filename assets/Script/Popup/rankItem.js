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

        this.updateLabelScore(rankInfo.rank);

        this.updateLabelLevel(rankInfo.rank);

        this.updateLabelName(rankInfo.rank);

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
                this.rankLabel.node.color = new cc.Color(186, 219, 243);
            } else if (rank === 3) {
                this.rankLabel.node.color = new cc.Color(205, 127, 50); 
            } else {
                this.rankLabel.node.color = cc.Color.WHITE;
            }
        }
    },

    updateLabelLevel(rank) {
        if (this.levelLabel) {
            
            if (rank === 1) {
                this.levelLabel.node.color = cc.Color.YELLOW; 
            } else if (rank === 2) {
                this.levelLabel.node.color = new cc.Color(186, 219, 243);
            } else if (rank === 3) {
                this.levelLabel.node.color = new cc.Color(205, 127, 50); 
            } else {
                this.levelLabel.node.color = cc.Color.WHITE;
            }
        }
    },

    updateLabelScore(rank) {
        if (this.scoreLabel) {
            
            if (rank === 1) {
                this.scoreLabel.node.color = cc.Color.YELLOW; 
            } else if (rank === 2) {
                this.scoreLabel.node.color = new cc.Color(186, 219, 243); 
            } else if (rank === 3) {
                this.scoreLabel.node.color = new cc.Color(205, 127, 50); 
            } else {
                this.scoreLabel.node.color = cc.Color.WHITE;
            }
        }
    },

    updateLabelName(rank) {
        if (this.playerNameLabel) {
            
            if (rank === 1) {
                this.playerNameLabel.node.color = cc.Color.YELLOW; 
            } else if (rank === 2) {
                this.playerNameLabel.node.color = new cc.Color(186, 219, 243);
            } else if (rank === 3) {
                this.playerNameLabel.node.color = new cc.Color(205, 127, 50); 
            } else {
                this.playerNameLabel.node.color = cc.Color.WHITE;
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
                    crownSprite.node.color = new cc.Color(186, 219, 243);
                } else if (rank === 3) {
                    crownSprite.node.color = new cc.Color(205, 127, 50);
                }
            }
        }
    },

    loadAvatar(avatarName) {
        if (!this.avatarSprite) {
            console.warn("Avatar sprite component is not assigned!");
            return;
        }

        if (!avatarName) {
            console.log("Không có avatar URL, dùng URL mặc định");
            avatarName = "https://avatar.iran.liara.run/public/boy?username=default";
        }

        if (this._currentAvatarName === avatarName) {
            return;
        }

        this.setAvatarLoadingState(true);
        
        this.loadAvatarFromUrl(avatarName);
    },

    loadAvatarFromUrl(avatarUrl) {
        if (!this.avatarSprite || !this.avatarSprite.isValid) {
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('GET', avatarUrl, true);
        xhr.responseType = 'arraybuffer';
        
        xhr.onload = () => {
            if (!this.avatarSprite || !this.avatarSprite.isValid) {
                return;
            }

            if (xhr.status === 200) {
                try {
                    const arrayBuffer = xhr.response;
                    const uint8Array = new Uint8Array(arrayBuffer);
                    
                    const img = new Image();
                    const blob = new Blob([uint8Array]);
                    const url = URL.createObjectURL(blob);
                    
                    img.onload = () => {
                        if (!this.avatarSprite || !this.avatarSprite.isValid) {
                            URL.revokeObjectURL(url);
                            return;
                        }

                        const texture = new cc.Texture2D();
                        texture.initWithElement(img);
                        texture.handleLoadedTexture();
                        
                        const spriteFrame = new cc.SpriteFrame();
                        spriteFrame.setTexture(texture);
                        
                        this.avatarSprite.spriteFrame = spriteFrame;
                        
                        this.adjustAvatarSize();

                        this._currentAvatarName = avatarUrl;
                        this.setAvatarLoadingState(false);
                        
                        URL.revokeObjectURL(url);
                        
                        console.log(`Đã load avatar từ URL: ${avatarUrl}`);
                    };
                    
                    img.onerror = () => {
                        URL.revokeObjectURL(url);
                        console.warn(`Lỗi load image từ URL: ${avatarUrl}`);
                        
                        if (avatarUrl.includes("username=default")) {
                            this.createSimpleAvatar();
                        } else {
                            this.loadAvatarFromUrl("https://avatar.iran.liara.run/public/boy?username=default");
                        }
                    };
                    
                    img.src = url;
                    
                } catch (error) {
                    console.error('Lỗi xử lý avatar image:', error);
                    this.createSimpleAvatar();
                }
            } else {
                console.warn(`HTTP error loading avatar: ${xhr.status}`);
                
                if (!avatarUrl.includes("username=default")) {
                    this.loadAvatarFromUrl("https://avatar.iran.liara.run/public/boy?username=default");
                } else {
                    this.createSimpleAvatar();
                }
            }
        };
        
        xhr.onerror = () => {
            console.warn(`Lỗi kết nối khi load avatar từ: ${avatarUrl}`);
            
            if (!avatarUrl.includes("username=default")) {
                this.loadAvatarFromUrl("https://avatar.iran.liara.run/public/boy?username=default");
            } else {
                this.createSimpleAvatar();
            }
        };
        
        xhr.ontimeout = () => {
            console.warn(`Timeout khi load avatar từ: ${avatarUrl}`);
            
            if (!avatarUrl.includes("username=default")) {
                this.loadAvatarFromUrl("https://avatar.iran.liara.run/public/boy?username=default");
            } else {
                this.createSimpleAvatar();
            }
        };
        
        xhr.timeout = 10000;
        
        try {
            xhr.send();
        } catch (error) {
            console.error('Lỗi khi gửi request avatar:', error);
            
            if (!avatarUrl.includes("username=default")) {
                this.loadAvatarFromUrl("https://avatar.iran.liara.run/public/boy?username=default");
            } else {
                this.createSimpleAvatar();
            }
        }
    },

    createSimpleAvatar() {
        if (!this.avatarSprite || !this.avatarSprite.isValid) {
            return;
        }
        
        this.setAvatarLoadingState(false);
        console.log("Tạo avatar đơn giản cho trường hợp không thể load");

        try {
            const size = 64;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            
            const ctx = canvas.getContext('2d');
            
            ctx.beginPath();
            ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
            ctx.fillStyle = this.getRandomColor();
            ctx.fill();
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', size/2, size/2);
            
            const img = new Image();
            img.src = canvas.toDataURL();
            
            img.onload = () => {
                if (!this.avatarSprite || !this.avatarSprite.isValid) return;
                
                const texture = new cc.Texture2D();
                texture.initWithElement(img);
                texture.handleLoadedTexture();
                
                const spriteFrame = new cc.SpriteFrame();
                spriteFrame.setTexture(texture);
                
                this.avatarSprite.spriteFrame = spriteFrame;
                
                this.adjustAvatarSize();

                console.log("Đã tạo avatar đơn giản thành công");
            };
        } catch (e) {
            console.error("Lỗi khi tạo avatar đơn giản:", e);
            this.createFallbackTexture();
        }
    },
    
    adjustAvatarSize() {
        if (!this.avatarSprite || !this.avatarSprite.node) return;
        
        const avatarNode = this.avatarSprite.node;
        
        const targetSize = 50; // Kích thước cố định 50x50
        avatarNode.width = targetSize;
        avatarNode.height = targetSize;
        
        this.avatarSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        this.avatarSprite.type = cc.Sprite.Type.SIMPLE;
        
        const mask = avatarNode.getComponent(cc.Mask);
        if (mask) {
            mask.type = cc.Mask.Type.ELLIPSE;
            mask.segements = 32; // Làm cho đường viền mịn hơn
        }
    },
    
    onLoad() {
        this._currentAvatarName = null;
    },
    
    setAvatarLoadingState(isLoading) {
        if (!this.avatarSprite || !this.avatarSprite.isValid) return;

        if (isLoading) {
            this.avatarSprite.node.opacity = 120;
        } else {
            this.avatarSprite.node.opacity = 255;
        }
    }
});