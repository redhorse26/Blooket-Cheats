/**
 * @license AGPL-3.0
 * Blooket Factory - Max Blooks (Level 4)
 * Sets all active blooks to max level immediately
 */

(() => {
    console.clear();
    console.log("💉 Factory: Maxing Levels...");

    let foundFactories = null;

    // Deep Scanner
    function scanDeep(obj, depth = 0) {
        if (depth > 8 || foundFactories) return;
        if (!obj || typeof obj !== 'object') return;

        if (obj.factories && Array.isArray(obj.factories) && obj.factories.length > 0) {
            const sample = obj.factories[0];
            if (sample.cash && sample.level !== undefined) {
                foundFactories = obj.factories;
                return;
            }
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
        if (foundFactories) return;
        const k = Object.keys(node).find(key => key.startsWith('__reactFiber'));
        if (k) scanDeep(node[k]);
        for (const child of node.children) traverseDOM(child);
    }
    traverseDOM(root);

    if (foundFactories) {
        let count = 0;
        foundFactories.forEach(factory => {
            factory.level = 4;
            // Optional: Reset time/cash to match level 4 if needed, 
            // but usually just setting level unlocks the sprite
            count++;
        });

        let iframe = document.createElement('iframe');
        document.body.append(iframe);
        iframe.contentWindow.alert(`✅ Set ${count} blooks to Level 4!\n\nIMPORTANT: Perform any action (buy/upgrade) to see the visual change.`);
        iframe.remove();
    } else {
        alert("❌ Could not find factories. Make sure you have at least one blook!");
    }
})();
