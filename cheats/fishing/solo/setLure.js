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
    const input = iframe.contentWindow.prompt("Enter Desired Lure Level (1-5):", "5");
    iframe.remove();

    if (!input) return;
    const targetInternal = parseInt(input) - 1; // UI Level 1-5 -> Internal 0-4
    if (isNaN(targetInternal) || targetInternal < 0 || targetInternal > 4) {
        return alert("❌ Please enter a number between 1 and 5.");
    }

    const root = document.querySelector('#app') || document.body;
    const rKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
    if (!rKey) return;

    let success = false;

    function findAndDispatch(node) {
        if (success || !node) return;
        if (node.memoizedProps && typeof node.memoizedProps.lureLevel === 'number') {
            const currentLevel = node.memoizedProps.lureLevel;
            let parent = node.return;
            while (parent) {
                if (parent.memoizedState) {
                    let hook = parent.memoizedState;
                    let i = 0;
                    while (hook) {
                        if (i === 2 && hook.queue?.dispatch) {
                            // Verify the value matches before dispatching
                            if (hook.memoizedState === currentLevel) {
                                hook.queue.dispatch(targetInternal);
                                success = true;
                                return;
                            }
                        }
                        hook = hook.next;
                        i++;
                    }
                }
                parent = parent.return;
            }
        }
        findAndDispatch(node.child);
        findAndDispatch(node.sibling);
    }

    findAndDispatch(root[rKey]);

    if (success) {
        alert(`✅ Lure Level permanently set to ${targetInternal + 1}!`);
    } else {
        alert("❌ Could not find Lure State Hook. Try catching one fish first.");
    }
})();
