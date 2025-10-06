/**
 * @license AGPL-3.0
 * Blooket Brawl - Set XP
 */

(() => {
    if (!window._scene?.gameManager) {
        alert("❌ Scene not found! Move around first.");
        return;
    }
    
    const gm = window._scene.gameManager;
    
    console.log("Current XP:", gm.totalXp);
    console.log("Current Level:", gm.level);
    console.log("Status:", gm.status);
    
    const newXp = prompt("Enter XP amount:", "1000");
    
    if (newXp !== null) {
        const xp = parseInt(newXp);
        
        gm.totalXp = xp;
        gm.curXp = xp;
        
        // Emit XP update event
        window._scene.eventBus.emit('xp-updated', xp);
        
        console.log("✅ XP set to:", xp);
        alert(`✅ XP Set!\n\nNew XP: ${xp}`);
    }
})();
