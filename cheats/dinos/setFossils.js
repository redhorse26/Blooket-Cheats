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
/* THE UPDATE CHECKER IS ADDED DURING COMMIT PREP, THERE MAY BE REDUNDANT CODE, DO NOT TOUCH */

/**
 * @license AGPL-3.0
 * Blooket Dino - Set Fossils/Score
 * Finds the useState hook holding '235' and dispatches a new value.
 */

(() => {
    console.clear();
    console.log("🦖 Dino: Setting Value...");

    const TARGET_VAL = 235; // Confirm this is still 235
    let foundHook = null;
    let foundQueue = null;

    // Helper to traverse Fiber Tree
    const root = document.querySelector('#app') || document.body;
    
    function findTargetComponent(node) {
        if (foundQueue) return; // Stop if found

        // Scan Hooks list
        let hook = node.memoizedState;
        while(hook) {
            // Check if this hook holds our target value directly
            if (hook.memoizedState === TARGET_VAL) {
                // Verify it has a queue (meaning it's a state hook we can update)
                if (hook.queue && hook.queue.dispatch) {
                    console.log(`%c🔥 FOUND STATE HOOK!`, "color: lime; font-weight: bold;");
                    console.log("   Component:", node.type ? (node.type.name || node.type) : "Unknown");
                    console.log("   Hook:", hook);
                    
                    foundHook = hook;
                    foundQueue = hook.queue;
                    return;
                }
            }
            hook = hook.next;
        }

        // Recurse tree
        if (node.child) findTargetComponent(node.child);
        if (node.sibling) findTargetComponent(node.sibling);
    }

    // Start Search
    const k = Object.keys(root).find(key => key.startsWith('__reactFiber'));
    if (k) {
        findTargetComponent(root[k]);
    } else {
        alert("❌ React Root not found.");
        return;
    }

    if (foundQueue) {
        // Prompt User
        let iframe = document.createElement('iframe');
        document.body.append(iframe);
        const input = iframe.contentWindow.prompt(`Current Value: ${TARGET_VAL}\n\nEnter New Value:`, "100000");
        iframe.remove();

        if (input) {
            const newValue = parseFloat(input);
            
            // Dispatch the update!
            // React dispatchers usually take an action: val => val
            const dispatch = foundQueue.dispatch;
            
            try {
                // We pass a function to ensure it treats it as a state update
                dispatch(() => newValue);
                alert(`✅ Set value to ${newValue}! \n(Perform an action in game to see it update visually)`);
            } catch (e) {
                console.error(e);
                alert("❌ Error dispatching update.");
            }
        }
    } else {
        alert(`❌ Could not find the Hook holding value ${TARGET_VAL}. \nDid the value change?`);
    }
})();
