cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: {
            default: null,
            type: cc.ProgressBar,
        },
        progressTip: {
            default: null,
            type: cc.Node,
        },
        sceneToLoad: {
            default: "Lobby",
        },
        label: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad() {
        this.progressBar.progress = 0;
        this.sceneLaunched = false;
        this.loadingCompleted = false;

        this.startPosX = -this.progressBar.totalLength / 2;

        if (this.progressTip) {
            this.progressTip.x = this.startPosX;
        }
        this.labelChangeWhenLoading();

        this.startLoading();
    },

    startLoading() {
        cc.director.preloadScene(
            this.sceneToLoad,
            this.onProgress.bind(this),
            (error) => {
                if (error) {
                    cc.log("Tải scene thất bại:", error.message);
                                        return;
                }

                this.loadingCompleted = true;
                this.progressBar.progress = 1;
            }
        );
    },

    labelChangeWhenLoading() {
        if (!this.label) {
            return;
        }
        let labelFrame = ["Loading", "Loading.", "Loading..", "Loading..."];
        let i = 0;
        this.labelTween = cc.tween(this.node).repeatForever(
            cc
                .tween()
                .call(() => {
                    this.label.string = labelFrame[i];
                    i = (i + 1) % labelFrame.length;
                })
                .delay(0.5)
        ).start();
    },

    onProgress(completedCount, totalCount, item) {
        if (this.progressBar) {
            this.progressBar.progress = completedCount / totalCount;
        }
    },

    update(dt) {
        if (this.progressTip) {
            const newX =
                this.startPosX +
                this.progressBar.totalLength * this.progressBar.progress;
            this.progressTip.x = newX;
        }

        if (this.loadingCompleted && this.progressBar.progress >= 1 && !this.sceneLaunched) {
            this.sceneLaunched = true;
        
            if (this.labelTween) {
                this.labelTween.stop();
            }
            
            cc.director.loadScene(this.sceneToLoad);
        }
    },

    onDestroy() {
        if (this.labelTween) {
            this.labelTween.stop();
        }
    }
});
