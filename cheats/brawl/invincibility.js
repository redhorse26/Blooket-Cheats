/**
 * Blooket Brawl Invincibility - Continuous Mode
 */

(() => {
    console.log("🎮 Blooket Brawl Invincibility - Continuous Mode\n");
    
    if (!window.Phaser) {
        alert("Phaser not found!");
        return;
    }
    
    console.log("✓ Phaser", window.Phaser.VERSION);
    
    let playerFound = false;
    let collidersDisabled = 0;
    
    // Continuous monitoring every 5ms
    const monitor = setInterval(() => {
        
        // Method 1: Find and protect player
        if (window.Phaser.GameObjects?.Sprite) {
            const originalUpdate = window.Phaser.GameObjects.Sprite.prototype.preUpdate;
            
            if (!window._invincibilityHooked) {
                window.Phaser.GameObjects.Sprite.prototype.preUpdate = function(time, delta) {
                    if (!window._sprites) window._sprites = new Set();
                    window._sprites.add(this);
                    
                    // Find player
                    if (this.texture?.key?.includes('player') || 
                        this.texture?.key?.includes('blook') ||
                        this.name?.includes('player')) {
                        
                        if (!window._player) {
                            console.log("✓✓✓ FOUND PLAYER!");
                            window._player = this;
                            playerFound = true;
                        }
                        
                        // Continuously set invincibility
                        if (this.setData) {
                            this.setData('invulnerable', true);
                            this.setData('invulnerableTime', Infinity);
                            this.setData('dmgCd', Infinity);
                        }
                    }
                    
                    return originalUpdate?.apply(this, arguments);
                };
                
                window._invincibilityHooked = true;
                console.log("✓ Sprite hook installed");
            }
        }
        
        // Method 2: Block collisions
        if (window.Phaser.Physics?.Arcade?.Body && !window._bodyHooked) {
            const originalUpdate = window.Phaser.Physics.Arcade.Body.prototype.preUpdate;
            
            window.Phaser.Physics.Arcade.Body.prototype.preUpdate = function() {
                if (this.gameObject?.texture?.key?.includes('player') ||
                    this.gameObject?.texture?.key?.includes('blook')) {
                    
                    if (!window._playerBody) {
                        window._playerBody = this;
                    }
                    
                    this.onCollide = false;
                    this.onWorldBounds = false;
                }
                
                return originalUpdate?.apply(this, arguments);
            };
            
            window._bodyHooked = true;
            console.log("✓ Body hook installed");
        }
        
        // Method 3: Disable collision processing
        if (window.Phaser.Physics?.Arcade?.World && !window._worldHooked) {
            const proto = window.Phaser.Physics.Arcade.World.prototype;
            
            if (proto.collideObjects) {
                const originalCollide = proto.collideObjects;
                
                proto.collideObjects = function(body1, body2, collideCallback, processCallback, callbackContext) {
                    if (body1 === window._playerBody || body2 === window._playerBody) {
                        return false;
                    }
                    return originalCollide.apply(this, arguments);
                };
            }
            
            if (proto.separate) {
                const originalSeparate = proto.separate;
                
                proto.separate = function(body1, body2, processCallback, callbackContext, overlapOnly) {
                    if (body1 === window._playerBody || body2 === window._playerBody) {
                        return false;
                    }
                    return originalSeparate.apply(this, arguments);
                };
            }
            
            window._worldHooked = true;
            console.log("✓ World collision hooks installed");
        }
        
    }, 5);
    
    // Status check after 3 seconds
    setTimeout(() => {
        console.log("\n=== STATUS ===");
        console.log("Player found:", playerFound ? "✓" : "✗");
        
        if (playerFound) {
            console.log("\n✅ INVINCIBILITY ACTIVE!");
            alert("✅ Invincibility Activated!\n\nYou are now invincible!");
            
            // Keep monitoring message
            console.log("\n🔄 Continuous monitoring active (every 5ms)");
            console.log("New enemies will be handled automatically!");
        }
    }, 3000);
    
    console.log("⏳ Monitoring started...");
    console.log("Move around in the game!");
    
    // Store interval ID so it can be stopped if needed
    window._invincibilityMonitor = monitor;
})();
