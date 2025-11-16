/**
 * @license AGPL-3.0
 * Blooket Brawl - Permanent Magnet
 * Gives permanent magnet effect
 */

(() => {
    console.log("🧲 Permanent Magnet\n");
    
    if (!window.Phaser) {
        alert("❌ Phaser not found!");
        return;
    }
    
    console.log("✓ Phaser", window.Phaser.VERSION);
    
    // Hook groups
    if (window.Phaser.GameObjects?.Group?.prototype && !window._groupHooked) {
        const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate || 
                              window.Phaser.GameObjects.Group.prototype.update;
        
        if (originalUpdate) {
            window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                if (!window._groups) window._groups = new Set();
                window._groups.add(this);
                return originalUpdate?.apply(this, args);
            };
            console.log("✓ Group hook installed");
            window._groupHooked = true;
        }
    }
    
    console.log("\n⏳ Waiting for scene...");
    
    setTimeout(() => {
        if (!window._groups || window._groups.size === 0) {
            alert("❌ Scene not found! Make sure you're playing!");
            return;
        }
        
        const scene = Array.from(window._groups)[0].scene;
        
        if (!scene || !scene.playerService || !scene.playerService.player) {
            alert("❌ Player not found!");
            return;
        }
        
        const player = scene.playerService.player;
        
        console.log("\n🧲 Current magnetTime:", player.magnetTime);
        
        // Set magnet time to 999999 seconds (basically permanent)
        player.magnetTime = 999999;
        
        console.log("✅ New magnetTime:", player.magnetTime);
        console.log("\n🧲 Permanent magnet activated!");
        console.log("All drops will now be attracted to you!");
        
        alert("✅ Permanent Magnet!\n\n🧲 You now have a magnet effect for 999999 seconds!\n\nAll XP and items will be pulled to you automatically!");
        
    }, 1000);
    
})();
