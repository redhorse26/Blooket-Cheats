/**
 * @license AGPL-3.0
 * Blooket Fishing Frenzy - Universal Weight Setter
 * reliably finds the Game Data object and modifies weight.
 */

(() => {
    console.clear();
    console.log("🎣 Fishing Frenzy: Universal Weight Setter...");

    let gameData = null;

    function scanDeep(obj, depth = 0) {
        if (depth > 8 || gameData) return;
        if (!obj || typeof obj !== 'object') return;

        // Signature Check: Look for the unique keys found in your log
        // { id, firstQuestion, startNumCorrects, weight }
        if (obj.weight !== undefined && obj.startNumCorrects !== undefined && obj.hwCorrectsGoal !== undefined) {
            console.log("%c🔥 FOUND GAME DATA!", "color: lime; font-weight: bold;");
            console.log("   Current Weight:", obj.weight);
            gameData = obj;
            return;
        }

        // Traversal
        if (Array.isArray(obj)) {
            obj.forEach(item => scanDeep(item, depth + 1));
        } else {
            if (obj.props) scanDeep(obj.props, depth + 1);
            if (obj.children) scanDeep(obj.children, depth + 1); // Props children often hold the data
            if (obj.memoizedProps) scanDeep(obj.memoizedProps, depth + 1);
            if (obj.memoizedState) scanDeep(obj.memoizedState, depth + 1);
        }
    }

    const root = document.querySelector('#app') || document.body;
    function traverseDOM(node) {
        if (gameData) return;
        const k = Object.keys(node).find(key => key.startsWith('__reactFiber'));
        if (k) scanDeep(node[k]);
        for (const child of node.children) traverseDOM(child);
    }
    traverseDOM(root);

    if (gameData) {
        let iframe = document.createElement('iframe');
        document.body.append(iframe);
        const input = iframe.contentWindow.prompt(`Current Weight: ${gameData.weight}\n\nEnter new Weight:`, "100000");
        iframe.remove();

        if (input) {
            const newWeight = parseFloat(input);
            // Modify in-place (By Reference)
            gameData.weight = newWeight;
            
            alert(`✅ Weight set to ${newWeight}!\n\nIMPORTANT: Catch a fish or answer a question to force the UI to update.`);
        }
    } else {
        alert("❌ Could not find Game Data object. \nMake sure you are in the game and have caught at least one fish.");
    }
})();
