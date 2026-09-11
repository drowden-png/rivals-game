// Player Class for Rivals Game

class Player {
    constructor(scene, x, y, color, controls) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.color = color;
        this.controls = controls;
        this.health = 100;
        this.maxHealth = 100;
        this.stamina = 100;
        this.maxStamina = 100;
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.velocity = { x: 0, y: 0 };
        this.speed = 150;
        this.jumpPower = 300;
        this.facing = 1; // 1 for right, -1 for left
        
        // Create sprite
        this.sprite = scene.add.rectangle(x, y, 40, 60, color);
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setBounce(0.2);
        this.sprite.body.setCollideWorldBounds(true);
    }

    update(cursors) {
        // Regenerate stamina
        if (this.stamina < this.maxStamina) {
            this.stamina += 0.5;
        }

        // Update cooldowns
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }

        // Apply gravity
        this.sprite.body.setAcceleration(0, 0);

        // Handle input based on controls
        this.handleMovement(cursors);
    }

    handleMovement(cursors) {
        let moving = false;

        // Player 1: WASD controls
        if (this.controls === 'player1') {
            if (cursors.w) {
                this.jump();
            }
            if (cursors.a) {
                this.sprite.body.setVelocityX(-this.speed);
                this.facing = -1;
                moving = true;
            }
            if (cursors.d) {
                this.sprite.body.setVelocityX(this.speed);
                this.facing = 1;
                moving = true;
            }
            if (cursors.space) {
                this.attack();
            }
        }
        // Player 2: Arrow keys controls
        else if (this.controls === 'player2') {
            if (cursors.up) {
                this.jump();
            }
            if (cursors.left) {
                this.sprite.body.setVelocityX(-this.speed);
                this.facing = -1;
                moving = true;
            }
            if (cursors.right) {
                this.sprite.body.setVelocityX(this.speed);
                this.facing = 1;
                moving = true;
            }
            if (cursors.shift) {
                this.attack();
            }
        }

        if (!moving) {
            this.sprite.body.setVelocityX(0);
        }
    }

    jump() {
        if (this.sprite.body.touching.down) {
            this.sprite.body.setVelocityY(-this.jumpPower);
        }
    }

    attack() {
        if (this.stamina >= 20 && this.attackCooldown === 0) {
            this.isAttacking = true;
            this.stamina -= 20;
            this.attackCooldown = 30; // 30 frame cooldown
            
            // Visual feedback
            this.sprite.setScale(1.2);
            this.scene.time.delayedCall(100, () => {
                this.sprite.setScale(1);
                this.isAttacking = false;
            });
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
        }
    }

    heal(amount) {
        this.health += amount;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
    }

    getPosition() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        };
    }

    setPosition(x, y) {
        this.sprite.setPosition(x, y);
    }

    destroy() {
        this.sprite.destroy();
    }
}
