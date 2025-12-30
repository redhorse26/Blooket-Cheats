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
 * Source of original work: https://github.com/Blooket-Council/Blooket-Cheats/tree/main
 * Source of this modified work: https://github.com/redhorse26/Blooket-Cheats/tree/main/cheats
 */

(() => {
    // 1. Clean up previous intervals if this script is run multiple times
    if (window.opCustomerInterval) {
        clearInterval(window.opCustomerInterval);
        console.log("%c[makeCustomersOP] Restarting loop...", "color: orange");
    }

    const OP_VALUE = 99999999999999; 

    // 2. The scanning logic
    function scanAndModify() {
        const root = document.querySelector('#app') || document.body;
        const rKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
        if (!rKey) return;

        let totalModified = 0;

        function traverse(node) {
            if (!node) return;

            // Check Hooks (Functional Components)
            if (node.memoizedState && typeof node.type === 'function') {
                let hook = node.memoizedState;
                while (hook) {
                    const data = hook.memoizedState;
                    
                    // Look for the Customer Map
                    if (data instanceof Map && data.size > 0) {
                        data.forEach((val) => {
                            // Verify it's a customer object
                            if (val && typeof val === 'object' && val.order && typeof val.order.value === 'number') {
                                // Only modify if not already OP
                                if (val.order.value !== OP_VALUE) {
                                    val.order.value = OP_VALUE;
                                    totalModified++;
                                }
                            }
                        });
                    }
                    hook = hook.next;
                }
            }

            traverse(node.child);
            traverse(node.sibling);
        }

        traverse(root[rKey]);

        // Only log if we actually did something (reduces spam)
        if (totalModified > 0) {
            console.log(`%c[makeCustomersOP] Upgraded ${totalModified} new customers!`, 'color: #00ff00; font-weight: bold');
        }
    }

    // 3. Start the Loop (Runs every 500ms)
    console.clear();
    console.log("%c[makeCustomersOP] Activated! New customers will be rich.", "color: #00ff00; font-size: 16px; font-weight: bold");
    
    // Save ID to window so we can stop it later if needed
    window.opCustomerInterval = setInterval(scanAndModify, 500);
})();
