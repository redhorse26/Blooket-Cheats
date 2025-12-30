/**
 * @license AGPL-3.0
 * Blooket Cheats (Modified Version)
 * Copyright (C) 2023-present 05Konz
 * Copyright (C) 2025-present redhorse26
 * 
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
 * Source of original work: [https://github.com/Blooket-Council/Blooket-Cheats/tree/main](https://github.com/Blooket-Council/Blooket-Cheats/tree/main)
 * Source of this modified work: [https://github.com/redhorse26/Blooket-Cheats/tree/main/cheats](https://github.com/redhorse26/Blooket-Cheats/tree/main/cheats)
*/
/**
 * 🎣 FISHING FRENZY: PERMANENT WEIGHT HACK
 * Targets Hook [2] on the 'iw' component to bypass the visual-only bug.
 */
(() => {
    const NEW_WEIGHT = 1000000; // Set your desired weight here

    const root = document.querySelector('#app') || document.body;
    const rKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
    if (!rKey) return console.log("❌ React Root not found");

    let success = false;

    function findAndSet(node) {
        if (success || !node) return;

        // Target the 'iw' node or any node with Hook [2] managing weight
        if (node.memoizedState) {
            let hook = node.memoizedState;
            let i = 0;
            while (hook) {
                // We are targeting Hook #2 specifically
                if (i === 2 && hook.queue && hook.queue.dispatch) {
                    const currentVal = hook.memoizedState;
                    
                    // Verify it's a number (weight) and not a string like 'Game'
                    if (typeof currentVal === 'number') {
                        console.log(`%c🎯 TARGET HOOK FOUND!`, "color: lime; font-weight: bold;");
                        console.log(`   Current Weight: ${currentVal}`);
                        
                        // Use the React Dispatcher to set the state permanently
                        hook.queue.dispatch(NEW_WEIGHT);
                        
                        console.log(`%c✅ SUCCESS! Weight set to ${NEW_WEIGHT}`, "color: #00ffff; font-weight: bold;");
                        success = true;
                        return;
                    }
                }
                hook = hook.next;
                i++;
            }
        }

        findAndSet(node.child);
        findAndSet(node.sibling);
    }

    findAndSet(root[rKey]);

    if (!success) {
        alert("❌ Could not find the Weight Hook. \nMake sure you have caught at least one fish first!");
    } else {
        alert(`✅ Weight set to ${NEW_WEIGHT}!\n\nJust catch one more fish to see the UI update.`);
    }
})();
