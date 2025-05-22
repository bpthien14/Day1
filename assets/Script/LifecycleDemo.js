cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        console.log('🔵 onLoad: Được gọi khi node được tạo và kích hoạt lần đầu.');
    },

    onEnable() {
        console.log('🟢 onEnable: Được gọi khi node hoặc component chuyển từ disabled sang enabled.');
    },

    start() {
        console.log('🟡 start: Được gọi một lần trước lần update đầu tiên.');
    },

    update(dt) {
        console.log('🟠 update: Được gọi mỗi frame. dt = ' + dt.toFixed(3));
    },

    lateUpdate(dt) {
        console.log('🔴 lateUpdate: Được gọi sau tất cả update và animation.');
    },

    onDisable() {
        console.log('⚫ onDisable: Được gọi khi node hoặc component bị tắt.');
    },

    onDestroy() {
        console.log('⚰️ onDestroy: Được gọi khi node hoặc component bị huỷ.');
    },
});
