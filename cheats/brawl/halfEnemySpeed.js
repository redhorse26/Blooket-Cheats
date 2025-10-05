/**
 * Blooket Brawl - Half Enemy Speed - Continuous Mode
 */

(() => {
    console.log("🐌 Half Enemy Speed - Continuous Mode\n");
    
    if (!window.Phaser) {
        alert("Phaser not found!");
        return;
    }
    
    console.log("✓ Phaser", window.Phaser.VERSION);
    
    let totalSlowed = 0;
    window._processedSpeeds = window._processedSpeeds || new Set();
    
    // Hook group collection
    if (window.Phaser.GameObjects?.Group?.prototype && !window._groupHookedSpeed) {
        const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate || 
                              window.Phaser.GameObjects.Group.prototype.update;
        
        if (originalUpdate) {
            window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                if (!window._groups) window._groups = new Set();
                window._groups.add(this);
                return originalUpdate?.apply(this, args);
            };
            console.log("✓ Group hook installed");
            window._groupHookedSpeed = true;
        }
    }
    
    // Continuous monitoring every 5ms
    const monitor = setInterval(() => {
        if (!window._groups) return;
        
        window._groups.forEach(group => {
            if (!group.children?.entries) return;
            
            group.children.entries.forEach(enemy => {
                // Skip if already processed
                if (window._processedSpeeds.has(enemy)) return;
                
                // Halve speed if enemy has speed property
                if (enemy.speed !== undefined && enemy.speed !== null) {
                    const oldSpeed = enemy.speed;
                    enemy.speed *= 0.5;
                    window._processedSpeeds.add(enemy);
                    totalSlowed++;
                    
                    if (totalSlowed <= 10) {
                        console.log(`✓ Slowed enemy: ${oldSpeed} → ${enemy.speed}`);
                    }
                }
            });
        });
        
    }, 5);
    
    // Status check
    setTimeout(() => {
        console.log("\n=== STATUS ===");
        console.log(`Enemies slowed: ${totalSlowed}`);
        
        if (totalSlowed > 0) {
            console.log("\n✅ HALF SPEED ACTIVE!");
            alert(`✅ Half Enemy Speed Activated!\n\n${totalSlowed} enemies slowed!\n\n🔄 Continuous monitoring: New enemies auto-slowed every 5ms`);
        }
        
        console.log("\n🔄 Continuous monitoring active (every 5ms)");
    }, 2000);
    
    console.log("⏳ Monitoring started...");
    console.log("Play the game normally!");
    
    window._speedMonitor = monitor;
})();
