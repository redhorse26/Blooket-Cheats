/**
 * ☕ BLOOKET CAFÉ - MAX STOCK & LEVELS
 * Safely sets all owned items to 999 Stock and Level 5.
 */

(() => {
    const root = document.querySelector('#app') || document.body;
    const rKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
    if (!rKey) return;

    let success = false;

    function traverse(node) {
        if (success || !node) return;

        if (node.memoizedState) {
            let hook = node.memoizedState;
            let index = 0;
            let hook4 = null; // Levels
            let hook5 = null; // Stock

            while (hook) {
                if (index === 4) hook4 = hook;
                if (index === 5) hook5 = hook;
                if (index > 5) break;
                hook = hook.next;
                index++;
            }

            if (hook4 && hook5) {
                const val4 = hook4.memoizedState;
                const val5 = hook5.memoizedState;
                
                // Validate structure
                if (val4 && val5 && typeof val4 === 'object' && typeof val5 === 'object' && val4.Toast !== undefined) {
                    
                    // 1. Max Levels
                    const newLevels = { ...val4 };
                    Object.keys(newLevels).forEach(key => {
                        if (typeof newLevels[key] === 'number') newLevels[key] = 5;
                    });

                    // 2. Max Stock
                    const newStock = { ...val5 };
                    Object.keys(newStock).forEach(key => {
                        if (typeof newStock[key] === 'number') newStock[key] = 999;
                    });

                    // Dispatch
                    hook4.queue.dispatch(newLevels);
                    hook5.queue.dispatch(newStock);
                    
                    success = true;
                }
            }
        }
        traverse(node.child);
        traverse(node.sibling);
    }

    traverse(root[rKey]);
})();
