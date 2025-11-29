/**
 * @license AGPL-3.0
 * Tower Defense - Max Towers (Fixed for Component Property)
 */

(() => {
    let iframe = document.createElement('iframe');
    document.body.append(iframe);
    window.alert = iframe.contentWindow.alert.bind(window);
    iframe.remove();
    
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
                        // CHECK 1: Check if 'towers' is a direct property (This is where we found it!)
                        if (node.towers && Array.isArray(node.towers)) return node;

                        // CHECK 2: Check state just in case (for round, etc)
                        if (node.state && node.state.round !== undefined) return node;
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
    
    const comp = searchDOM();
    
    if (!comp) { 
        alert("❌ Component not found!"); 
        return; 
    }
    
    // Check if towers exist on the component
    if (!comp.towers || comp.towers.length === 0) {
        alert("⚠️ No towers found! Place a tower first.");
        return;
    }

    console.log("Found Towers:", comp.towers);

    // Modify Towers
    comp.towers.forEach(tower => {
        tower.range = 100;
        tower.cd = 0;
        tower.damage = 1000000;
        
        // Some p5 sketches use a 'stats' object or 'level' property
        if (tower.stats) {
            tower.stats.damage = 1000000;
            tower.stats.range = 100;
            tower.stats.fireRate = 0.01;
        }
    });

    alert(`✅ Upgraded ${comp.towers.length} towers!`);
    
    // Since 'towers' is not in state, React won't re-render automatically.
    // However, p5.js usually reads these values every frame in 'draw()', so it should just work instantly.
    // If not, we can try forcing an update:
    if (comp.forceUpdate) comp.forceUpdate();

})();
