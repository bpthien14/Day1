# Design Patterns trong Game Development

## 1. Command Pattern
**Là gì?**
- Pattern tách rời người gọi lệnh và người thực hiện lệnh thông qua một object trung gian (Command)
- Command đóng gói thông tin cần thiết để thực hiện hành động sau này

**Làm như thế nào?**
```typescript
interface ICommand {
    execute(): void;
}

class JumpCommand implements ICommand {
    private player: Player;
    
    constructor(player: Player) {
        this.player = player;
    }
    
    execute() {
        this.player.jump();
    }
}
```

**Dùng khi nào?**
- Xử lý input từ người chơi (keyboard, gamepad)
- Undo/Redo system
- Replay system
- Queue các action để thực hiện sau

**Ví dụ game:**
- Input mapping trong game: Map phím space vào JumpCommand
- Replay: Lưu lại sequence các command để replay lại 
- Turn-based game: Queue các action của player

## 2. Singleton Pattern 
**Là gì?**
- Đảm bảo một class chỉ có duy nhất một instance
- Cung cấp điểm truy cập toàn cục đến instance đó

**Làm như thế nào?**
```typescript
class GameManager {
    private static instance: GameManager;
    
    private constructor() {}
    
    static getInstance(): GameManager {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }
}
```

**Dùng khi nào?**
- Quản lý trạng thái game toàn cục
- Resource sharing 
- Điều phối các hệ thống

**Ví dụ game:**
- GameManager: Quản lý state game
- AudioManager: Quản lý âm thanh
- ScoreManager: Quản lý điểm số

## 3. Observer Pattern
**Là gì?**
- Định nghĩa cơ chế để thông báo tự động cho nhiều object khi có thay đổi
- Giảm sự phụ thuộc giữa các object

**Làm như thế nào?**
```typescript
interface IObserver {
    onNotify(event: GameEvent): void;
}

class Subject {
    private observers: IObserver[] = [];
    
    addObserver(observer: IObserver) {
        this.observers.push(observer);
    }
    
    notify(event: GameEvent) {
        this.observers.forEach(observer => observer.onNotify(event));
    }
}
```

**Dùng khi nào?**
- Event system
- Loosely coupled communication
- UI updates

**Ví dụ game:**
- Health changes -> Update UI
- Score changes -> Update leaderboard
- Achievement system

## 4. Flyweight Factory Pattern
**Là gì?**
- Tối ưu việc sử dụng bộ nhớ bằng cách chia sẻ dữ liệu chung giữa nhiều object
- Factory để tạo và quản lý các flyweight objects

**Làm như thế nào?**
```typescript
class BulletFactory {
    private static bulletData: Map<string, BulletData> = new Map();
    
    static createBullet(type: string): Bullet {
        if (!this.bulletData.has(type)) {
            this.bulletData.set(type, new BulletData(type));
        }
        return new Bullet(this.bulletData.get(type));
    }
}
```

**Dùng khi nào?**
- Nhiều object có data chung
- Cần tối ưu memory
- Particle systems

**Ví dụ game:**
- Particle effects
- Bullet pools
- Tile maps

## 5. State Pattern
**Là gì?**
- Cho phép object thay đổi behavior khi internal state thay đổi
- Tách logic của từng state thành các class riêng biệt

**Làm như thế nào?**
```typescript
interface IPlayerState {
    update(): void;
    onEnter(): void;
    onExit(): void;
}

class IdleState implements IPlayerState {
    private player: Player;
    
    constructor(player: Player) {
        this.player = player;
    }
    
    update() {
        if (this.player.isMoving()) {
            this.player.changeState(new RunState(this.player));
        }
    }
    
    onEnter() {
        this.player.playAnimation("idle");
    }
    
    onExit() {}
}
```

**Dùng khi nào?**
- Complex state machines
- Behavior changes based on state
- Clean state transitions

**Ví dụ game:**
- Character states: Idle, Run, Jump, Attack
- Game states: Menu, Playing, Paused
- AI behavior states

## Tổng kết
Mỗi pattern giải quyết một vấn đề cụ thể:
- Command: Decoupling và queuing actions
- Singleton: Global state & resource management  
- Observer: Event handling & loose coupling
- Flyweight Factory: Memory optimization
- State: Complex state-based behavior

Việc kết hợp các pattern này giúp tạo ra game architecture có tính:
- Maintainable (Dễ bảo trì)
- Scalable (Dễ mở rộng)
- Reusable (Tái sử dụng cao)
- Optimized (Tối ưu)