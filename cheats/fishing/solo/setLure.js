/**
 * @license AGPL-3.0
 * Blooket Cheats
 * Copyright (C) 2025-present redhorse26
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * Source: [https://github.com/redhorse26/Blooket-Cheats/tree/main/cheats](https://github.com/redhorse26/Blooket-Cheats/tree/main/cheats)
*/
(() => {
    console.clear();
    console.log("🎣 Fishing Frenzy: Setting Lure Level...");

    let lureState = null;

    function scanDeep(obj, depth = 0) {
        if (depth > 10 || lureState) return;
        if (!obj || typeof obj !== 'object') return;

        // Look for object with 'lureLevel' property
        if (obj.lureLevel !== undefined) {
            // Verify it's the game state (might have weight or other props nearby)
            // Or just take the first one that looks valid (value 0-5)
            if (typeof obj.lureLevel === 'number' && obj.lureLevel >= 0 && obj.lureLevel <= 5) {
                console.log("%c🔥 FOUND LURE STATE!", "color: lime; font-weight: bold;", obj);
                lureState = obj;
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
        if (lureState) return;
        const k = Object.keys(node).find(key => key.startsWith('__reactFiber'));
        if (k) scanDeep(node[k]);
        for (const child of node.children) traverseDOM(child);
    }
    traverseDOM(root);

    if (lureState) {
        let iframe = document.createElement('iframe');
        document.body.append(iframe);
        const input = iframe.contentWindow.prompt(`Current Lure Level: ${lureState.lureLevel + 1}\n\nEnter Desired Level (1-5):`, "5");
        iframe.remove();

        if (input) {
            let level = parseInt(input);
            if (isNaN(level) || level < 1) level = 1;
            if (level > 5) level = 5;

            // Set internal value (input - 1)
            lureState.lureLevel = level - 1;
            
            alert(`✅ Lure Level set to ${level} (Internal: ${level - 1})!\n\nIMPORTANT: Play the game (cast/reel) to see changes.`);
        }
    } else {
        alert("❌ Could not find Lure State object.");
    }
})();
