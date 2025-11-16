/**
 * @license AGPL-3.0
 * Blooket Brawl - Auto OP Abilities (Continuous)
 * Automatically makes all abilities OP, checks every 3 seconds
 */

(() => {
    // ===== CONFIGURATION =====
    const SIZE_MULTIPLIER = 5; // ← CHANGE THIS NUMBER (1 = normal, 5 = 5x, 10 = 10x, etc.)
    const CHECK_INTERVAL = 3000; // Check every 3 seconds
    // =========================
    
    // Prevent duplicate runs
    if (window._autoOpAbilitiesRunning) {
        alert("❌ Script is already running!");
        return;
    }
    window._autoOpAbilitiesRunning = true;
    
    console.log(`💥 Auto OP Abilities (${SIZE_MULTIPLIER}x Size)\n`);
    console.log("⏰ Checking every 3 seconds for new abilities...\n");
    
    if (!window.Phaser) {
        alert("❌ Phaser not found!");
        return;
    }
    
    console.log("✓ Phaser", window.Phaser.VERSION);
    
    // Track processed abilities and their original widths
    window._processedAbilities = window._processedAbilities || new Set();
    window._originalWidths = window._originalWidths || {};
    
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
    
    let totalUnlocked = 0;
    let totalModified = 0;
    
    // Function to process abilities
    const processAbilities = () => {
        if (!window._groups || window._groups.size === 0) return;
        
        const scene = Array.from(window._groups)[0].scene;
        
        if (!scene || !scene.abilityService) return;
        
        // Check all abilities that have stats
        Object.keys(scene.abilityService.abilityStats).forEach(ability => {
            // Skip if already processed
            if (window._processedAbilities.has(ability)) return;
            
            const stats = scene.abilityService.abilityStats[ability];
            
            console.log(`\n🆕 New ability detected: ${ability}`);
            
            // Store original width before modification
            if (stats.width !== undefined) {
                window._originalWidths[ability] = stats.width;
            }
            
            // Unlock ability if not already unlocked
            if (scene.abilityService.abilityLevels[ability] === undefined) {
                scene.abilityService.abilityLevels[ability] = 1;
                console.log(`  🔓 Unlocked!`);
                totalUnlocked++;
            }
            
            // Modify stats
            if (stats.dmg !== undefined) {
                stats.dmg = 9999;
            }
            
            if (stats.fireRate !== undefined) {
                stats.fireRate = 50;
            }
            
            if (stats.maxTargets !== undefined) {
                stats.maxTargets = 999;
            }
            
            if (stats.numProjectiles !== undefined) {
                stats.numProjectiles = 50;
            }
            
            if (stats.speed !== undefined) {
                stats.speed = 2000;
            }
            
            if (stats.lifespan !== undefined && stats.lifespan > 0) {
                stats.lifespan = 10000;
            }
            
            if (stats.knockback !== undefined) {
                stats.knockback = 5;
            }
            
            // Use original width for multiplication
            if (stats.width !== undefined && window._originalWidths[ability]) {
                const originalWidth = window._originalWidths[ability];
                stats.width = Math.round(originalWidth * SIZE_MULTIPLIER);
                console.log(`  📏 Size: ${originalWidth} → ${stats.width} (${SIZE_MULTIPLIER}x)`);
            }
            
            if (stats.intervalRate !== undefined) {
                stats.intervalRate = 10;
            }
            
            console.log(`  ✅ ${ability} is now OP!`);
            
            // Mark as processed
            window._processedAbilities.add(ability);
            totalModified++;
        });
    };
    
    // Initial process after 1 second
    setTimeout(() => {
        console.log("\n🔍 Initial scan...");
        processAbilities();
        
        if (totalModified > 0) {
            console.log(`\n✅ Initial scan complete!`);
            console.log(`🔓 Unlocked: ${totalUnlocked}`);
            console.log(`💥 Modified: ${totalModified}`);
        }
    }, 1000);
    
    // Continuous monitoring every 3 seconds
    const monitor = setInterval(() => {
        processAbilities();
    }, CHECK_INTERVAL);
    
    window._autoOpMonitor = monitor;
    
    console.log("\n✅ Auto OP script started!");
    console.log(`⏰ Monitoring every ${CHECK_INTERVAL/1000} seconds`);
    console.log(`📏 Size multiplier: ${SIZE_MULTIPLIER}x`);
    console.log("\n💡 New abilities will be automatically made OP!");
    console.log("💡 To stop: clearInterval(window._autoOpMonitor)");
    
})();
