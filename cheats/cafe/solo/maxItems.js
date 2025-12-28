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
    // 1. Setup UI (iframe for clean alerts)
    let iframe = document.querySelector("iframe");
    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.append(iframe);
    }
    const alert = iframe.contentWindow.alert.bind(window);

    // 2. Main Cheat Logic
    const cheat = () => {
        const root = document.querySelector('#app') || document.body;
        const rKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
        
        if (!rKey) return alert("❌ React Root not found. Please reload.");

        let success = false;

        function traverse(node) {
            if (success || !node) return;

            if (node.memoizedState) {
                let hook = node.memoizedState;
                let index = 0;
                let levelHook = null;

                // Traverse Hooks to find Index #4
                while (hook) {
                    if (index === 4) {
                        levelHook = hook;
                        break; 
                    }
                    hook = hook.next;
                    index++;
                }

                // VALIDATE: Is this the Level Map?
                // Structure: { Toast: 5, Cereal: 1... }
                if (levelHook) {
                    const val = levelHook.memoizedState;
                    if (val && typeof val === 'object' && !Array.isArray(val) && val.Toast !== undefined) {
                        
                        // CREATE HACKED STATE
                        const newLevels = { ...val };
                        Object.keys(newLevels).forEach(key => {
                            if (typeof newLevels[key] === 'number') {
                                newLevels[key] = 5; // Max Level
                            }
                        });

                        // DISPATCH
                        if (levelHook.queue && levelHook.queue.dispatch) {
                            levelHook.queue.dispatch(newLevels);
                            success = true;
                            alert("✅ All items upgraded to Level 5!");
                        }
                    }
                }
            }
            traverse(node.child);
            traverse(node.sibling);
        }

        traverse(root[rKey]);
        
        if (!success) alert("❌ Cheat failed. Make sure you are in the game.");
    };

    cheat();

})();
