/**
 * @license AGPL-3.0
 * Tower Defense - Set Round
 */

(() => {
    let iframe = document.createElement('iframe');
    document.body.append(iframe);
    window.prompt = iframe.contentWindow.prompt.bind(window);
    iframe.remove();
    
    function searchDOM(element = document.body, depth = 0) {
        if (depth > 5) return null;
        const keys = Object.keys(element);
        const reactKey = keys.find(k => k.includes('react'));
        if (reactKey) {
            try {
                let fiber = element[reactKey];
                while (fiber) {
                    if (fiber._owner && fiber._owner.stateNode && fiber._owner.stateNode.state) {
                        const state = fiber._owner.stateNode.state;
                        if (state.round !== undefined) return fiber._owner.stateNode;
                    }
                    if (fiber.stateNode && fiber.stateNode.state) {
                        const state = fiber.stateNode.state;
                        if (state.round !== undefined) return fiber.stateNode;
                    }
                    fiber = fiber.return;
                }
            } catch (e) {}
        }
        for (const child of element.children) {
            const result = searchDOM(child, depth + 1);
            if (result) return result;
        }
        return null;
    }
    
    const comp = searchDOM();
    if (!comp) { alert("❌ Component not found!"); return; }
    
    const round = parseInt(prompt("What round do you want to set to?")) || 0;
    comp.setState({ round });
    alert(`✅ Round set to ${round}!`);
})();
