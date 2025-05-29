cc.Class({
    extends: cc.Component,

    properties: {
        // Collider Component
        collider: {
            default: null,
            type: cc.Collider,
        },
    },

    onLoad() {
        // Enable the collision manager
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // Enable debug draw for collision shapes
        manager.enabledDebugDraw = true;
    },
    onCollisionEnter: function (other, self) {
        console.log("on collision enter");
        // Collider Manager will calculate the value in world coordinate system, and put them into the world property
        var world = self.world;
        // Collider Component aabb bounding box
        var aabb = world.aabb;
        // The position of the aabb collision frame before the node collision
        var preAabb = world.preAabb;
        // world transform
        var t = world.transform;
        // Circle Collider Component world properties
        var r = world.radius;
        var p = world.position;
        // Rect and Polygon Collider Component world properties
        var ps = world.points;
    },
    /**
        * Call after enter collision, before end collision, and after every time calculate
        the collision result.
        * @param {Collider} other The other Collider Component
        * @param {Collider} self Self Collider Component
        */
    onCollisionStay: function (other, self) {
        console.log("on collision stay");
    },
    /**
     * Call after end collision
     * @param {Collider} other The other Collider Component
     * @param {Collider} self Self Collider Component
     */
    onCollisionExit: function (other, self) {
        console.log("on collision exit");
    },
});
