cc.Class({
    extends: cc.Component,

    properties: {
        spineCharacter: {
            type: sp.Skeleton,
            default: null,
        },
        buttonPrefab: {
            type: cc.Prefab,
            default: null,
        },
        buttonLayout: {
            type: cc.Node,
            default: null,
        },
    },

    onLoad() {
        if (!this.spineCharacter || !this.buttonPrefab || !this.buttonLayout) {
            return;
        }

        this.generateAnimationButtons();
    },

    generateAnimationButtons() {
        this.buttonLayout.removeAllChildren();
    
        const animations = this.spineCharacter.skeletonData.getRuntimeData().animations;
    
        if (!animations) {
            cc.warn("Không tìm thấy danh sách animation trong Spine asset.");
            return;
        }
    
        animations.forEach(anim => {
            const animName = anim.name;
            let newButtonNode = cc.instantiate(this.buttonPrefab);

            let labelNode = cc.find('Background/Label', newButtonNode);
    
            if (labelNode) {
                let buttonLabel = labelNode.getComponent(cc.Label);
                buttonLabel.string = animName;
            } else {
                cc.warn(`Không tìm thấy Node 'Background/Label' trong Prefab cho animation: ${animName}`);
                let topLevelLabelNode = newButtonNode.getChildByName('Label');
                if (topLevelLabelNode) {
                    topLevelLabelNode.getComponent(cc.Label).string = animName;
                }
            }
    
            this.buttonLayout.addChild(newButtonNode);
    
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = 'TestSpine';
            clickEventHandler.handler = 'onAnimationButtonClick';
            clickEventHandler.customEventData = animName;
    
            let buttonComponent = newButtonNode.getComponent(cc.Button);
            buttonComponent.clickEvents.push(clickEventHandler);
        });
    },

    onAnimationButtonClick(event, customEventData) {
        const animName = customEventData;
        cc.log(`Đang phát animation: ${animName}`);

        this.spineCharacter.setAnimation(0, animName, true);
    },
});