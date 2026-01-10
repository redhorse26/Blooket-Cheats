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

async function sellBlook(blookName, quantity) {
    const formData = new FormData();
    formData.append('1_blook', blookName);
    formData.append('1_quantity', quantity.toString());
    formData.append('0', '[{"status":"UNSET","message":"","fieldErrors":{}},"$K1"]');

    try {
        const response = await fetch('https://dashboard.blooket.com/blooks', {
            method: 'POST',
            headers: {
                'next-action': '504d5bfe3d4b01def79630a2138ec4f50f85bee9',
                'accept': 'text/x-component',
                'next-router-state-tree': '%5B%22%22%2C%7B%22children%22%3A%5B%22(routes)%22%2C%7B%22children%22%3A%5B%22(dashboard)%22%2C%7B%22children%22%3A%5B%22blooks%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%2Ctrue%5D'
            },
            body: formData
        });

        if (response.ok) {
            console.log(`Successfully sold ${quantity}x ${blookName}`);
        } else {
            console.error(`Failed to sell ${blookName}: ${response.status}`);
        }
    } catch (err) {
        console.error("Network error during sale:", err);
    }
}
window.blookslist = (() => {
    const anyEl = document.querySelector('*');
    const fiberKey = Object.keys(anyEl).find(k => k.startsWith('__reactFiber$'));
    let fiber = anyEl[fiberKey];
    while (fiber && fiber.return) {
        fiber = fiber.return;
    }
    const path = "child.child.child.child.child.child.child.child.child.child.sibling.child.child.child.child.child.child.child.child.sibling.child.child.sibling.child.child.child.child.sibling.child.sibling.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.sibling.child.sibling.sibling.sibling.sibling.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.sibling.child.child";
    let target = fiber;
    path.split('.').forEach(key => {
        target = target ? target[key] : null;
    });
    return target?.memoizedProps?.blooks;
})();
let key = "konzpack",
    propCall = Object.prototype.hasOwnProperty.call;
let webpack = webpackChunk_N_E.push([
    [key],
    { [key]: () => {} },
    function (func) {
        Object.prototype.hasOwnProperty.call = function () {
            Object.defineProperty(arguments[0], key, { set: () => {}, configurable: true });
            return (Object.prototype.hasOwnProperty.call = propCall).apply(this, arguments);
        };
        return func;
    },
]);
const blookData = webpack(4927).nK;
prices = {
    Uncommon: 5,
    Rare: 20,
    Epic: 75,
    Legendary: 200,
    Chroma: 300,
    Unique: 350,
    Mystical: 1000,
};
let sellAmt = 0;
let sellBlookAmt = 0;
for (let blook of blookslist) {
    console.log(blook);
    rarity = blookData[blook.blook].rarity;
    console.log(rarity);
    if (blook.quantity > 1 && ["Uncommon","Rare","Epic"].includes(rarity)){
        sellBlook(blook.blook,blook.quantity - 1);
        sellBlookAmt+=blook.quantity - 1;
        sellAmt+=prices[rarity];
    }
}
alert("Sold " + sellBlookAmt + " blooks for " + sellAmt + " Tokens.");
