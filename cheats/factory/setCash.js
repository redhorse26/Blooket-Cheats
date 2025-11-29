/**
 * @license AGPL-3.0
 * Blooket Factory - Set Cash (Exact)
 * Calculates difference and uses addCash to hit exact target
 */

(() => {
    console.clear();
    console.log("🏦 Factory: Setting Exact Cash...");

    let gameState = null;

    function scanDeep(obj, depth = 0) {
        if (depth > 8 || gameState) return;
        if (!obj || typeof obj !== 'object') return;

        // Look for object with both cash value AND addCash function
        if (obj.factories && typeof obj.addCash === 'function' && obj.cash !== undefined) {
            gameState = obj;
            return;
        }

        if (Array.isArray(obj)) {
            obj.forEach(item => scanDeep(item, depth + 1));
        } else {
            if (obj.props) scanDeep(obj.props, depth + 1);
            if (obj.children) scanDeep(obj.children, depth + 1);
            if (obj.memoizedProps) scanDeep(obj.memoizedProps, depth + 1);
            if (obj.memoizedState) scanDeep(obj.memoizedState, depth + 1);
        }
    }

    const root = document.querySelector('#app') || document.body;
    function traverseDOM(node) {
        if (gameState) return;
        const k = Object.keys(node).find(key => key.startsWith('__reactFiber'));
        if (k) scanDeep(node[k]);
        for (const child of node.children) traverseDOM(child);
    }
    traverseDOM(root);

    if (gameState) {
        const current = gameState.cash;
        
        let iframe = document.createElement('iframe');
        document.body.append(iframe);
        const input = iframe.contentWindow.prompt(`Current Cash: ${current}\n\nEnter new EXACT amount:`, "1000000000");
        iframe.remove();

        if (input !== null) {
            const target = parseFloat(input);
            if (!isNaN(target)) {
                const diff = target - gameState.cash;
                
                // If we need to remove money, add a negative amount
                gameState.addCash(diff);
                
                alert(`✅ Cash set to ${target}!`);
            }
        }
    } else {
        alert("❌ Could not find Game Controller.");
    }
})();
