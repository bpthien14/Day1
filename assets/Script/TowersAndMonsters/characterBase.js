const CharacterStates = require('./characterStates');
const StateMachine = require('javascript-state-machine');

cc.Class({
    extends: cc.Component,

    properties: {
        hp: 100,
        moveSpeed: 50,
        attackDamage: 20,
        attackInterval: 1,
        hitStunDuration: 0.3, 
    },

    onLoad() {
        this.currentState = CharacterStates.IDLE;
        this.isMoving = false;
        this.isAttacking = false;
        this.targetTower = null;
        this.walkTween = null;
        this.currentHp = this.hp;
        this.originalColor = null;
    },

    init(controller) {
        this.controller = controller;
        const canvas = cc.find("Canvas");
        if (!canvas) {
            cc.error("Cannot find Canvas node!");
            return;
        }
        this.damageTextManager = canvas.getComponent("damageTextManager");
        if (!this.damageTextManager) {
            cc.error("Cannot find damageTextManager component!");
            return;
        }

        const sprite = this.node.getComponent(cc.Sprite);
        if (sprite) {
            this.originalColor = sprite.node.color.clone();
        }
        
        this.initStateMachine();
        
        this.scheduleOnce(() => {
            if (this.fsm) {
                this.setState(CharacterStates.MOVING);
            }
        }, 0);
    },

    initStateMachine() {
        this.fsm = new StateMachine({
            init: CharacterStates.IDLE,
            transitions: [
                { name: 'move', from: '*', to: CharacterStates.MOVING },
                { name: 'attack', from: '*', to: CharacterStates.ATTACKING },
                { name: 'hit', from: '*', to: CharacterStates.BEING_HIT },
                { name: 'die', from: '*', to: CharacterStates.DYING }
            ],
            methods: {
                onEnterMoving: () => {
                    this.isMoving = true;
                    this.isAttacking = false;
                    this.startWalkEffect();
                    this.resetColor();
                },
                onEnterAttacking: () => {
                    this.isMoving = false;
                    this.isAttacking = true;
                    this.attack();
                    this.schedule(this.attack, this.attackInterval);
                },
                onEnterBeingHit: () => {
                    this.isMoving = false;
                    this.isAttacking = false;
                    this.unscheduleAllCallbacks();
                    this.changeColor();
                    
                    this.scheduleOnce(() => {
                        if (this.fsm && this.fsm.state === CharacterStates.BEING_HIT) {
                            if (this.targetTower) {
                                this.setState(CharacterStates.ATTACKING);
                            } else {
                                this.setState(CharacterStates.MOVING);
                            }
                        }
                    }, this.hitStunDuration);
                },
                onEnterDying: () => {
                    this.isMoving = false;
                    this.isAttacking = false;
                    this.unscheduleAllCallbacks();
                },
                onLeaveAttacking: () => {
                    this.unschedule(this.attack);
                },
                onLeaveMoving: () => {
                    this.stopWalkEffect();
                },
                onLeaveBeingHit: () => {
                    this.resetColor();
                }
            }
        });
    },

    setState(newState) {
        if (this.fsm.state === newState) return;
        
        switch(newState) {
            case CharacterStates.MOVING:
                this.fsm.move();
                break;
            case CharacterStates.ATTACKING:
                this.fsm.attack();
                break;
            case CharacterStates.BEING_HIT:
                this.fsm.hit();
                break;
            case CharacterStates.DYING:
                this.fsm.die();
                break;
        }
    },

    changeColor() {
        const sprite = this.node.getComponent(cc.Sprite);
        if (sprite) {
            sprite.node.color = cc.Color.RED;
        }
    },

    resetColor() {
        const sprite = this.node.getComponent(cc.Sprite);
        if (sprite && this.originalColor) {
            sprite.node.color = this.originalColor;
        }
    },

    update(dt) {
        if (this.fsm && this.fsm.state === CharacterStates.MOVING) {
            this.node.x -= this.moveSpeed * dt * 2;
        }

        if (this.fsm && this.fsm.state === CharacterStates.ATTACKING && (!this.targetTower || !this.targetTower.isValid)) {
            this.setState(CharacterStates.MOVING);
        }

        if (this.node.x < -cc.winSize.width) {
            this.onKilled();
        }
    },

    onCollisionEnter(other, self) {
        if (other.node.group === "Turret" && this.currentState !== CharacterStates.DYING) {
            this.stopWalkEffect();
            this.node.angle = 0;
            this.targetTower = other.node;

            const dogWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
            const towerWorldPos = other.node.convertToWorldSpaceAR(cc.v2(0, 0));
            this.lastCollisionPos = cc.v2(
                (dogWorldPos.x + towerWorldPos.x) / 2,
                (dogWorldPos.y + towerWorldPos.y) / 2
            );

            this.setState(CharacterStates.ATTACKING);
        }
    },

    onCollisionExit(other, self) {
        if (other.node === this.targetTower) {
            this.setState(CharacterStates.MOVING);
        }
    },

    attack() {
        if (this.targetTower && this.targetTower.isValid) {
            this.playAttackEffect(() => {
                if (this.targetTower && this.targetTower.isValid) {
                    const towerItem = this.targetTower.getComponent("towerItem");
                    if (towerItem) {
                        towerItem.onHit(this.attackDamage);
                        this.showDamageAtPosition(this.lastCollisionPos, this.attackDamage);
                    }
                }
            });
        }
    },

    showDamageAtPosition(worldPos, damage, isDot = false) {
        if (!this.damageTextManager) {
            this.damageTextManager = cc.find("Canvas").getComponent("damageTextManager");
            if (!this.damageTextManager) return;
        }
        if (!worldPos) return;
        this.damageTextManager.showDamageText(worldPos, damage, isDot);
    },

    resumeMovement() {
        this.startWalkEffect();
        this.unschedule(this.attack);
        this.isMoving = true;
        this.isAttacking = false;
        this.targetTower = null;
    },

    takeDamage(damage) {
        this.currentHp = Math.max(0, this.currentHp - damage);
        
        const worldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 30));
        this.showDamageAtPosition(worldPos, damage);
        
        const greenDog = this.getComponent('greenDog');
        if (greenDog && greenDog.hpBar) {
            greenDog.hpBar.progress = this.currentHp / this.hp;
        }

        if (this.currentHp > 0) {
            this.setState(CharacterStates.BEING_HIT);
        } else {
            this.setState(CharacterStates.DYING);
            this.onKilled();
        }
    },

    onKilled() {
        this.setState(CharacterStates.DYING);
        if (this.controller) {
            this.controller.onMonsterKilled(this.node);
        }
        this.node.destroy();
    },

    playAttackEffect(callback) {

    },

    startWalkEffect() {
    },

    stopWalkEffect() {
    }
});