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
(() => {

    let iframe = document.createElement('iframe');
    document.body.append(iframe);
    const input = iframe.contentWindow.prompt("Enter your desired weight:", "1000000");
    iframe.remove();

    if (!input) return;
    const NEW_WEIGHT = parseFloat(input);

    const root = document.querySelector('#app') || document.body;
    const rKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
    if (!rKey) return console.log("❌ React Root not found");

    let success = false;

    function findAndSet(node) {
        if (success || !node) return;

        if (node.memoizedState) {
            let hook = node.memoizedState;
            let i = 0;
            while (hook) {

                if (i === 2 && hook.queue?.dispatch) {
                    const currentVal = hook.memoizedState;

                    if (typeof currentVal === 'number') {
                        hook.queue.dispatch(NEW_WEIGHT);
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

    if (success) {
        alert(`✅ Weight set to ${NEW_WEIGHT.toLocaleString()}!\n\nCatch a fish to update the UI.`);
    } else {
        alert("❌ Could not find Weight Hook. Catch one fish first!");
    }
})();

