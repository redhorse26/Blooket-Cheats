/**
 * Direct Phaser Object Access - Registry Method
 */

(() => {
    console.clear();
    console.log("🎯 DIRECT OBJECT ACCESS\n");
    
    if (!window.Phaser) {
        alert("Phaser not found!");
        return;
    }
    
    // Strategy: Access Phaser's internal DisplayList
    // Every Phaser game stores all objects in a registry
    
    console.log("Attempting deep Phaser access...\n");
    
    // Method 1: Find canvas and extract WebGL context
    const canvas = document.querySelector('#phaser-game canvas');
    if (!canvas) {
        alert("Canvas not found!");
        return;
    }
    
    console.log("✓ Canvas found");
    
    // Try to find the Phaser game through the canvas's contexts
    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
    const ctx2d = canvas.getContext('2d');
    
    console.log("WebGL context:", gl ? "✓" : "✗");
    console.log("2D context:", ctx2d ? "✓" : "✗");
    
    // Method 2: Hook into Phaser GameObject updates
    console.log("\n=== HOOKING GAMEOBJECT ===");
    
    // Intercept Phaser.GameObjects.Sprite update
    if (window.Phaser.GameObjects?.Sprite) {
        const originalUpdate = window.Phaser.GameObjects.Sprite.prototype.preUpdate;
        
        window.Phaser.GameObjects.Sprite.prototype.preUpdate = function(time, delta) {
            // Store reference to player sprite
            if (!window._sprites) window._sprites = new Set();
            window._sprites.add(this);
            
            // Look for player-specific properties
            if (this.texture?.key?.includes('player') || 
                this.texture?.key?.includes('blook') ||
                this.name?.includes('player')) {
                
                if (!window._player) {
                    console.log("✓✓✓ FOUND PLAYER SPRITE!");
                    console.log("  Texture:", this.texture.key);
                    console.log("  Name:", this.name);
                    console.log("  Keys:", Object.keys(this));
                    
                    window._player = this;
                    
                    // Make player invincible
                    if (this.setData) {
                        this.setData('invulnerable', true);
                        this.setData('invulnerableTime', Infinity);
                        this.setData('dmgCd', Infinity);
                        console.log("✓ Set invulnerability data");
                    }
                }
            }
            
            return originalUpdate?.apply(this, arguments);
        };
        
        console.log("✓ Sprite.preUpdate hooked");
    }
    
    // Method 3: Hook Physics Bodies
    if (window.Phaser.Physics?.Arcade?.Body) {
        const originalUpdate = window.Phaser.Physics.Arcade.Body.prototype.preUpdate;
        
        window.Phaser.Physics.Arcade.Body.prototype.preUpdate = function() {
            if (!window._bodies) window._bodies = new Set();
            window._bodies.add(this);
            
            // Check if this is the player body
            if (this.gameObject?.texture?.key?.includes('player') ||
                this.gameObject?.texture?.key?.includes('blook')) {
                
                if (!window._playerBody) {
                    console.log("✓✓✓ FOUND PLAYER PHYSICS BODY!");
                    window._playerBody = this;
                    
                    // Disable collision callbacks
                    this.onCollide = false;
                    this.onWorldBounds = false;
                    
                    console.log("✓ Disabled collision callbacks");
                }
            }
            
            return originalUpdate?.apply(this, arguments);
        };
        
        console.log("✓ Body.preUpdate hooked");
    }
    
    // Method 4: Intercept collision callbacks at a lower level
    if (window.Phaser.Physics?.Arcade?.World) {
        const proto = window.Phaser.Physics.Arcade.World.prototype;
        
        // Hook collideObjects (called when objects collide)
        if (proto.collideObjects) {
            const originalCollide = proto.collideObjects;
            
            proto.collideObjects = function(body1, body2, collideCallback, processCallback, callbackContext) {
                // If either body is the player, skip collision
                if (body1 === window._playerBody || body2 === window._playerBody) {
                    console.log("🛡️ Blocked player collision!");
                    return false;
                }
                
                return originalCollide.apply(this, arguments);
            };
            
            console.log("✓ World.collideObjects hooked");
        }
        
        // Hook separate (handles actual collision)
        if (proto.separate) {
            const originalSeparate = proto.separate;
            
            proto.separate = function(body1, body2, processCallback, callbackContext, overlapOnly) {
                // Block player damage
                if (body1 === window._playerBody || body2 === window._playerBody) {
                    return false;
                }
                
                return originalSeparate.apply(this, arguments);
            };
            
            console.log("✓ World.separate hooked");
        }
    }
    
    // Method 5: Set up monitor
    console.log("\n✅ ALL HOOKS INSTALLED");
    console.log("\n📋 NOW:");
    console.log("1. Move your character around");
    console.log("2. The script will detect and modify the player object");
    console.log("3. Check console for confirmations");
    
    setTimeout(() => {
        console.log("\n=== STATUS CHECK ===");
        console.log("Sprites found:", window._sprites?.size || 0);
        console.log("Bodies found:", window._bodies?.size || 0);
        console.log("Player found:", window._player ? "✓" : "✗");
        console.log("Player body found:", window._playerBody ? "✓" : "✗");
        
        if (window._player) {
            console.log("\n✅ PLAYER OBJECT CAPTURED!");
            console.log("You should now be invincible!");
            alert("✅ Invincibility activated!\nPlayer object captured and modified.");
        } else {
            console.log("\n⏳ Still searching...");
            console.log("Keep moving around in the game!");
        }
    }, 3000);
    
})();
