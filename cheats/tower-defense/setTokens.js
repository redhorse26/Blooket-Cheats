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
    function getComp(element = document.body, depth = 0) {
        if (depth > 20) return null;
        const fiber = element[Object.keys(element).find(k => k.includes('react'))];
        if (fiber) {
            let curr = fiber;
            while (curr) {
                const sn = curr.stateNode || curr._owner?.stateNode;
                if (sn?.state?.tokens !== undefined) return sn;
                curr = curr.return;
            }
        }
        for (const child of element.children) {
            const result = getComp(child, depth + 1);
            if (result) return result;
        }
    }
    const sn = getComp();
    if (!sn) return;
    let iframe = document.createElement('iframe');
    document.body.append(iframe);
    const input = iframe.contentWindow.prompt("Enter new Token amount:", sn.state.tokens);
    iframe.remove();
    if (input) sn.setState({ tokens: parseInt(input) });
})();

