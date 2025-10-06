/**
 * @license AGPL-3.0
 * Blooket Brawl - Set XP (Complete)
 */

(() => {
    console.log("💎 Set XP\n");
    
    // Hook Phaser to get scene
    if (window.Phaser?.GameObjects?.Group?.prototype && !window._xpSceneHook) {
        const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate || 
                              window.Phaser.GameObjects.Group.prototype.update;
        
        if (originalUpdate) {
            window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                if (!window._scene && this.scene) {
                    window._scene = this.scene;
                    console.log("✓ Scene captured!");
                }
                return originalUpdate?.apply(this, args);
            };
            window._xpSceneHook = true;
        }
    }
    
    console.log("✓ Phaser hook installed");
    console.log("⏳ Waiting for scene...");
    console.log("\nMove around in the game to activate!");
    
    let checkCount = 0;
    
    // Keep checking until scene is found
    const checkInterval = setInterval(() => {
        checkCount++;
        
        if (checkCount % 10 === 0) {
            console.log(`  Still waiting... (${checkCount / 2}s) - Move around!`);
        }
        
        if (window._scene?.gameManager) {
            clearInterval(checkInterval);
            
            const gm = window._scene.gameManager;
            
            console.log("\n✓✓✓ Scene found!");
            console.log("Current XP:", gm.totalXp);
            console.log("Current Level:", gm.level);
            console.log("Status:", gm.status);
            
            const newXp = prompt("Enter XP amount:", "1000");
            
            if (newXp !== null) {
                const xp = parseInt(newXp);
                
                if (isNaN(xp)) {
                    alert("❌ Invalid number!");
                    return;
                }
                
                gm.totalXp = xp;
                gm.curXp = xp;
                
                // Emit XP update event
                window._scene.eventBus.emit('xp-updated', xp);
                
                console.log("✅ XP set to:", xp);
                alert(`✅ XP Set!\n\nNew XP: ${xp}\nLevel: ${gm.level}`);
            } else {
                console.log("Cancelled");
            }
        }
        
    }, 200); // Check every 200ms
    
    // Timeout after 60 seconds
    setTimeout(() => {
        if (window._scene?.gameManager) return;
        
        clearInterval(checkInterval);
        console.log("\n❌ Timeout - scene not found after 60 seconds");
        alert("❌ Timeout!\n\nMove around in the game and try again.");
    }, 60000);
})();
