cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: {
            default: null,
            type: cc.ProgressBar,
            tooltip: "Thanh tiến trình chính"
        },
        progressTip: {
            default: null,
            type: cc.Node,
        },
        sceneToLoad: {
            default: 'Lobby',
            type: cc.String,
        },
    },

    onLoad() {
        this.progressBar.progress = 0;

        this.startPosX = -this.progressBar.totalLength / 2;

        if (this.progressTip) {
            this.progressTip.x = this.startPosX;
        }

        this.startLoading();
    },

    startLoading() {
        cc.director.preloadScene(this.sceneToLoad, this.onProgress.bind(this), (error) => {
            if (error) {
                cc.log('Tải scene thất bại:', error.message);
                return;
            }

            this.progressBar.progress = 1;
        });
    },

    onProgress(completedCount, totalCount, item) {
        if (this.progressBar) {
            this.progressBar.progress = completedCount / totalCount;
        }
    },

    update(dt) {
        if (this.progressTip) {
            const newX = this.startPosX + this.progressBar.totalLength * this.progressBar.progress;
            this.progressTip.x = newX;
        }

        if (this.progressBar.progress >= 1) {
            if (!this.sceneLaunched) {
                this.sceneLaunched = true;
                cc.director.loadScene(this.sceneToLoad);
            }
        }
    }
});