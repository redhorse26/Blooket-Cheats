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
 * 💸 BLOOKET CAFÉ - MAX ECONOMY (FIXED)
 * Costs: 1 (Fixes "Buy" button logic)
 * Fake Profits: 9e99
 */

(() => {
    console.clear();
    console.log("%c💸 SETTING COST: 1 | PROFIT: 9e99", "color: #ff00ff; font-weight: bold;");

    const root = document.querySelector('#app') || document.body;
    const rKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
    if (!rKey) return console.log("❌ React Root not found");

    let success = false;

    function traverse(node) {
        if (success || !node) return;

        if (node.memoizedState) {
            let hook = node.memoizedState;
            let index = 0;
            
            while(hook) {
                // Target Hook 1 (Definitions)
                if (index === 1) {
                    const val = hook.memoizedState;
                    
                    if (val && typeof val === 'object' && val.toast && val.toast.prices) {
                        const newDefs = { ...val };
                        const items = Object.keys(newDefs);

                        items.forEach(key => {
                            const item = newDefs[key];
                            if (item && item.prices && item.profits) {
                                // 1. Costs -> 1 (Avoids falsy checks)
                                const cheapPrices = new Array(item.prices.length).fill(1);
                                
                                // 2. Profits -> 9e99
                                const insaneProfits = new Array(item.profits.length).fill(9e99);
                                insaneProfits[0] = 0; // Keep lvl 0 safe
                                
                                newDefs[key] = {
                                    ...item,
                                    prices: cheapPrices,
                                    profits: insaneProfits
                                };
                            }
                        });

                        if (hook.queue && hook.queue.dispatch) {
                            hook.queue.dispatch(newDefs);
                            success = true;
                            console.log("%c✅ DONE. Try upgrading now.", "color: #00ff00; font-weight: bold;");
                        }
                    }
                }
                hook = hook.next;
                index++;
            }
        }
        traverse(node.child);
        traverse(node.sibling);
    }

    traverse(root[rKey]);
    
    if (!success) console.log("❌ Failed to find definitions hook.");
})();
