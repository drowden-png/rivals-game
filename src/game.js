// Rivals Game - Multiplayer Fighting Game
// Inspired by Roblox Rivals

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player1;
let player2;
let keysPressed = {};
let p1HealthText;
let p2HealthText;

function preload() {
    // Load assets here
}

function create() {
    // Create players using Player class
    player1 = new Player(this, 200, 300, 0xff0000, 'player1');
    player2 = new Player(this, 1080, 300, 0x0000ff, 'player2');

    // Ground
    const ground = this.add.rectangle(640, 650, 1280, 100, 0x888888);
    this.physics.add.existing(ground);
    ground.body.setImmovable(true);

    // Collisions
    this.physics.add.collider(player1.sprite, ground);
    this.physics.add.collider(player2.sprite, ground);
    this.physics.add.overlap(player1.sprite, player2.sprite, handleCollision, null, this);

    // Input setup
    setupControls(this);

    // UI
    p1HealthText = this.add.text(50, 20, 'Player 1: 100/100', { fontSize: '24px', fill: '#ff0000' });
    p2HealthText = this.add.text(1080, 20, 'Player 2: 100/100', { fontSize: '24px', fill: '#0000ff' });
    
    this.add.text(640, 20, 'RIVALS', { fontSize: '28px', fill: '#ffffff' }).setOrigin(0.5, 0);
}

function setupControls(scene) {
    scene.input.keyboard.on('keydown', (event) => {
        const key = event.key.toLowerCase();
        keysPressed[key] = true;
    });
    scene.input.keyboard.on('keyup', (event) => {
        const key = event.key.toLowerCase();
        keysPressed[key] = false;
    });
}

function update() {
    // Create control objects for each player
    const p1Controls = {
        w: keysPressed['w'],
        a: keysPressed['a'],
        d: keysPressed['d'],
        space: keysPressed[' ']
    };

    const p2Controls = {
        up: keysPressed['arrowup'] || keysPressed['ArrowUp'],
        left: keysPressed['arrowleft'] || keysPressed['ArrowLeft'],
        right: keysPressed['arrowright'] || keysPressed['ArrowRight'],
        shift: keysPressed['shift']
    };

    // Update players
    player1.update(p1Controls);
    player2.update(p2Controls);

    // Update UI
    p1HealthText.setText(`Player 1: ${Math.floor(player1.health)}/100`);
    p2HealthText.setText(`Player 2: ${Math.floor(player2.health)}/100`);

    // Game over check
    if (player1.health <= 0) {
        alert('Player 2 Wins!');
        location.reload();
    }
    if (player2.health <= 0) {
        alert('Player 1 Wins!');
        location.reload();
    }
}

function handleCollision(p1, p2) {
    // Both players attacking = damage both
    if (player1.isAttacking && player2.isAttacking) {
        player1.takeDamage(10);
        player2.takeDamage(10);
    }
    // Player 1 attacking
    else if (player1.isAttacking) {
        const distance = Math.abs(p1.x - p2.x);
        if (distance < 80) {
            player2.takeDamage(15);
            p2.setVelocityX(200 * player1.facing);
        }
    }
    // Player 2 attacking
    else if (player2.isAttacking) {
        const distance = Math.abs(p1.x - p2.x);
        if (distance < 80) {
            player1.takeDamage(15);
            p1.setVelocityX(200 * player2.facing);
        }
    }
}