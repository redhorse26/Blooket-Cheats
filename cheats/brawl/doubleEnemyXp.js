/**
 * @license AGPL-3.0
 * Blooket Brawl - Double Enemy XP (All-in-One)
 * Updated October 2025 - Phaser Interception Method
 */

(() => {
    console.log("💎 Double Enemy XP - Starting...\n");
    
    if (!window.Phaser) {
        alert("❌ Phaser not found! Make sure you're in Monster Brawl.");
        return;
    }
    
    console.log("✓ Phaser", window.Phaser.VERSION);
    
    let enemiesModified = 0;
    let hooksInstalled = 0;
    
    // Step 1: Hook Group.update to collect all groups
    if (window.Phaser.GameObjects?.Group?.prototype) {
        const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate || 
                              window.Phaser.GameObjects.Group.prototype.update;
        
        if (originalUpdate) {
            window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                if (!window._groups) window._groups = new Set();
                window._groups.add(this);
                return originalUpdate?.apply(this, args);
            };
            console.log("✓ Group hook installed");
            hooksInstalled++;
        }
    }
    
    // Step 2: Hook GameObjectFactory.existing to catch enemy creation
    if (window.Phaser.GameObjects?.GameObjectFactory?.prototype?.existing) {
        const originalExisting = window.Phaser.GameObjects.GameObjectFactory.prototype.existing;
        
        window.Phaser.GameObjects.GameObjectFactory.prototype.existing = function(gameObject) {
            const result = originalExisting.apply(this, arguments);
            
            // Double XP for newly created enemies
            if (result && result.val !== undefined && !result._xpDoubled) {
                const oldVal = result.val;
                result.val *= 2;
                result._xpDoubled = true;
                console.log(`✓ Auto-doubled new enemy: ${oldVal} → ${result.val}`);
            }
            
            return result;
        };
        console.log("✓ GameObjectFactory.existing hooked");
        hooksInstalled++;
    }
    
    // Step 3: Wait for groups to be collected, then modify them
    setTimeout(() => {
        console.log("\n=== PROCESSING GROUPS ===");
        
        if (!window._groups || window._groups.size === 0) {
            console.log("⚠️ No groups found yet. Play a bit more and run again!");
            return;
        }
        
        const groups = Array.from(window._groups);
        console.log(`Found ${groups.length} groups\n`);
        
        groups.forEach((group, index) => {
            if (!group.children?.entries) return;
            
            const children = group.children.entries;
            if (children.length === 0) return;
            
            // Check if this group has enemies (has val property)
            const hasVal = children.some(child => child.val !== undefined);
            
            if (hasVal) {
                console.log(`\n✓✓✓ Group ${index} has enemies (${children.length} children)`);
                
                // Double all enemies in this group
                let groupModified = 0;
                children.forEach(child => {
                    if (child.val !== undefined && !child._xpDoubled) {
                        const oldVal = child.val;
                        child.val *= 2;
                        child._xpDoubled = true;
                        enemiesModified++;
                        groupModified++;
                        
                        if (groupModified <= 3) {
                            console.log(`  Enemy: ${oldVal} → ${child.val} XP`);
                        }
                    }
                });
                
                if (groupModified > 3) {
                    console.log(`  ... and ${groupModified - 3} more enemies`);
                }
                
                // Hook the group's classType for future enemies
                if (group.classType?.prototype) {
                    const methods = ['start', 'init', 'create'];
                    
                    methods.forEach(method => {
                        if (group.classType.prototype[method] && !group.classType.prototype[`_${method}Hooked`]) {
                            const original = group.classType.prototype[method];
                            
                            group.classType.prototype[method] = function(...args) {
                                const result = original.apply(this, args);
                                
                                if (this.val && !this._xpDoubled) {
                                    this.val *= 2;
                                    this._xpDoubled = true;
                                    console.log(`✓ Auto-doubled via ${method}: ${this.val}`);
                                }
                                
                                return result;
                            };
                            
                            group.classType.prototype[`_${method}Hooked`] = true;
                            hooksInstalled++;
                        }
                    });
                }
            }
        });
        
        // Summary
        console.log("\n\n=== SUMMARY ===");
        console.log(`Groups checked: ${groups.length}`);
        console.log(`Enemies modified: ${enemiesModified}`);
        console.log(`Hooks installed: ${hooksInstalled}`);
        
        if (enemiesModified > 0) {
            console.log("\n✅ SUCCESS!");
            console.log("- Existing enemies: 2x XP");
            console.log("- Future enemies: Auto 2x XP");
            alert(`✅ Double Enemy XP Activated!\n\n${enemiesModified} enemies now give 2x XP!\nNew enemies will automatically have doubled XP.`);
        } else {
            console.log("\n⚠️ No enemies found");
            console.log("Make sure you're actively playing (not in menu)");
            console.log("Try killing some enemies first, then run again!");
        }
        
    }, 2000);
    
    console.log("\n⏳ Collecting game objects...");
    console.log("Play the game normally for 2 seconds...");
    
})();
