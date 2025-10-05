/**
 * Blooket Brawl - Double Enemy XP - Continuous Mode
 */

(() => {
    console.log("💎 Double Enemy XP - Continuous Mode\n");
    
    if (!window.Phaser) {
        alert("Phaser not found!");
        return;
    }
    
    console.log("✓ Phaser", window.Phaser.VERSION);
    
    let totalModified = 0;
    window._processedEnemies = window._processedEnemies || new Set();
    
    // Hook group collection
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
    
    // Continuous monitoring every 5ms
    const monitor = setInterval(() => {
        if (!window._groups) return;
        
        window._groups.forEach(group => {
            if (!group.children?.entries) return;
            
            group.children.entries.forEach(enemy => {
                // Skip if already processed
                if (window._processedEnemies.has(enemy)) return;
                
                // Double XP if enemy has val property
                if (enemy.val !== undefined && enemy.val !== null) {
                    const oldVal = enemy.val;
                    enemy.val *= 2;
                    window._processedEnemies.add(enemy);
                    totalModified++;
                    
                    if (totalModified <= 10) {
                        console.log(`✓ Doubled enemy: ${oldVal} → ${enemy.val}`);
                    }
                }
            });
        });
        
    }, 5);
    
    // Status check
    setTimeout(() => {
        console.log("\n=== STATUS ===");
        console.log(`Enemies modified: ${totalModified}`);
        
        if (totalModified > 0) {
            console.log("\n✅ DOUBLE XP ACTIVE!");
            alert(`✅ Double Enemy XP Activated!\n\n${totalModified} enemies modified!\n\n🔄 Continuous monitoring: New enemies auto-doubled every 5ms`);
        }
        
        console.log("\n🔄 Continuous monitoring active (every 5ms)");
    }, 2000);
    
    console.log("⏳ Monitoring started...");
    console.log("Play the game normally!");
    
    window._xpMonitor = monitor;
})();
