/**
 * @license AGPL-3.0
 * Blooket Brawl - Reset Health (Fixed)
 */

(() => {
    console.log("❤️ Reset Health\n");
    
    // Hook Phaser to get scene
    if (window.Phaser?.GameObjects?.Group?.prototype && !window._healthHook) {
        const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate || 
                              window.Phaser.GameObjects.Group.prototype.update;
        
        if (originalUpdate) {
            window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                if (!window._scene && this.scene) {
                    window._scene = this.scene;
                }
                return originalUpdate?.apply(this, args);
            };
            window._healthHook = true;
        }
    }
    
    setTimeout(() => {
        if (!window._scene?.eventBus) {
            alert("❌ Scene not found! Move around and try again.");
            return;
        }
        
        try {
            // Trigger respawn event
            const respawnEvent = window._scene.eventBus._events?.respawn;
            
            if (respawnEvent?.fn) {
                console.log("✓ Found respawn event");
                respawnEvent.fn();
                console.log("✅ Health reset!");
                alert("✅ Health Reset!\n\nYour health is now full!");
            } else if (respawnEvent && typeof respawnEvent === 'function') {
                respawnEvent();
                console.log("✅ Health reset!");
                alert("✅ Health Reset!\n\nYour health is now full!");
            } else {
                // Try emitting directly
                window._scene.eventBus.emit('respawn');
                console.log("✅ Respawn event emitted!");
                alert("✅ Health Reset!\n\nRespawn triggered!");
            }
        } catch (e) {
            console.log("❌ Error:", e);
            alert(`❌ Error: ${e.message}`);
        }
        
    }, 1000);
    
    console.log("⏳ Getting scene...");
})();
