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
 * ☕ BLOOKET CAFÉ HACK - SET CASH
 * @license MIT
 * Features: Auto-Hook Detection, Custom Amount Prompt
 */

(() => {
    // 1. SETUP & UI
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    const prompt = iframe.contentWindow.prompt; // Use secure iframe prompt
    
    // Ask for amount
    const amountStr = prompt("💸 ENTER DESIRED CASH AMOUNT:", "1000000");
    document.body.removeChild(iframe);
    
    if (!amountStr) return; // Cancelled
    const newAmount = parseInt(amountStr.replace(/,/g, ''), 10);
    
    if (isNaN(newAmount)) {
        alert("❌ Invalid number entered.");
        return;
    }

    console.clear();
    console.log(`%c☕ APPLYING CASH HACK: $${newAmount.toLocaleString()}`, "color: #ff9900; font-weight: bold; font-size: 1.2em;");

    // 2. FIND REACT HOOK (The 9th Hook Pattern)
    function findCashDispatcher() {
        const root = document.querySelector('#app') || document.body;
        const rKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
        if (!rKey) return null;
        
        let result = null;
        
        function traverse(node) {
            if (result || !node) return;
            
            // Check for hooks
            if (node.memoizedState) {
                let hook = node.memoizedState;
                let depth = 0;
                
                // We are looking for the hook chain where a hook equals the numeric cash value
                // Since we don't know the exact current cash, we look for the *structure*
                // Café money is usually a primitive number inside a deep hook chain.
                // We can't search by value anymore since it changes.
                // Instead, we search for the specific React Component signature of the Café Controller.
                
                // Signature: A component that has many hooks, and one of them is likely a number > 0
                // We will brute force: Dispatch to ALL number-based hooks in likely components.
                
                while (hook) {
                    const val = hook.memoizedState;
                    // Candidate: A number that looks like a score/cash (e.g. > 0)
                    // or just any number if you have 0 cash.
                    if (typeof val === 'number' && hook.queue && hook.queue.dispatch) {
                         // We found a number hook with a dispatcher.
                         // In Café, the cash hook is deep (around #9 or #10).
                         // We'll collect ALL of them and let the user brute force or intelligent guess.
                         if (depth > 5) { // Cash is usually deep
                             if (!result) result = [];
                             result.push(hook.queue.dispatch);
                         }
                    }
                    hook = hook.next;
                    depth++;
                }
            }
            traverse(node.child);
            traverse(node.sibling);
        }
        
        traverse(root[rKey]);
        return result;
    }

    // 3. EXECUTE
    // Since we successfully found it by searching for '1512' specifically before,
    // we know it exists. But now we don't know the current value to search for.
    // OPTIMIZATION: We will re-use the exact path you found earlier:
    // "State/Hooks.next.next.next.next.next.next.next.next.memoizedState"
    
    function setCashByStructure() {
        const root = document.querySelector('#app') || document.body;
        const rKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
        
        let found = false;
        
        function traverse(node) {
            if (found || !node) return;
            
            if (node.memoizedState) {
                // Hardcoded path to the 9th hook (next x 8)
                let h = node.memoizedState;
                try {
                    // Try to walk 8 steps down
                    for(let i=0; i<8; i++) { if(h) h = h.next; }
                    
                    if (h && h.memoizedState !== undefined && typeof h.memoizedState === 'number') {
                        // Check if this component looks like the game controller 
                        // (e.g. has many hooks, usually 10+)
                        let count = 0;
                        let temp = node.memoizedState;
                        while(temp) { count++; temp = temp.next; }
                        
                        if (count > 10 && h.queue && h.queue.dispatch) {
                             console.log(`%c⚡ Found candidate Hook (Value: ${h.memoizedState})`, "color: #00ff00");
                             h.queue.dispatch(newAmount);
                             found = true;
                        }
                    }
                } catch(e) {}
            }
            traverse(node.child);
            traverse(node.sibling);
        }
        
        if (rKey) traverse(root[rKey]);
        return found;
    }

    const success = setCashByStructure();

    if (success) {
        console.log("%c✅ SUCCESS: Money Updated!", "background: green; color: white; padding: 5px; font-size: 1.2em");
        alert(`💰 Cash set to ${newAmount.toLocaleString()}!\n\n(If it doesn't show immediately, buy something cheap to refresh)`);
    } else {
        console.log("❌ Could not pinpoint the exact hook automatically.");
        console.log("⚠️ Fallback: Trying to set ALL deep numeric states...");
        
        // Fallback: Set ANY deep number hook to the new amount (Risky but effective)
        const dispatchers = findCashDispatcher();
        if (dispatchers && dispatchers.length > 0) {
            dispatchers.forEach(d => d(newAmount));
            alert("⚠️ Brute-force update sent. Check your cash.");
        } else {
            alert("❌ Failed to find game state. Are you in the Café game?");
        }
    }
})();
