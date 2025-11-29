/**
 * @license AGPL-3.0
 * Tower Defense - Remove All Enemies (Fixed)
 */

(() => {
    // 1. Setup UI helpers
    let iframe = document.createElement('iframe');
    document.body.append(iframe);
    window.alert = iframe.contentWindow.alert.bind(window);
    iframe.remove();
    
    // 2. Robust React Finder
    function searchDOM(element = document.body, depth = 0) {
        if (depth > 5) return null;
        const keys = Object.keys(element);
        const reactKey = keys.find(k => k.includes('react'));
        if (reactKey) {
            try {
                let fiber = element[reactKey];
                while (fiber) {
                    const node = fiber.stateNode || (fiber._owner ? fiber._owner.stateNode : null);
                    
                    if (node) {
                        // We know 'enemies' is a direct property on this component
                        if (node.enemies && Array.isArray(node.enemies)) return node;
                        // Fallback: Check state if it moved
                        if (node.state && node.state.enemies) return node;
                    }
                    fiber = fiber.return;
                }
            } catch (e) {}
        }
        for (const child of element.children) {
            const result = searchDOM(child, depth + 1);
            if (result) return result;
        }
        return null;
    }
    
    // 3. Execute Cheat
    const comp = searchDOM();
    
    if (!comp) { 
        alert("❌ Component not found! Make sure you are in-game."); 
        return; 
    }

    // Clear Enemies (Direct Property)
    if (comp.enemies) {
        const count = comp.enemies.length;
        comp.enemies = []; // Clear active enemies
        comp.futureEnemies = []; // Clear queued enemies
        
        // Clear state if it exists there too (just to be safe)
        if (comp.state && comp.state.enemies) {
            comp.setState({ enemies: [], futureEnemies: [] });
        }

        alert(`✅ Removed ${count} enemies and cleared the wave!`);
    } else {
        alert("⚠️ No enemies found to remove.");
    }

})();
