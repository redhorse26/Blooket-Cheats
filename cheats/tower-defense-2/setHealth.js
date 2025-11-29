/**
 * @license AGPL-3.0
 * TD2 - Set Health (Final)
 * Targets: scene.gameManager.health
 */

(() => {
    // 1. SETUP UI
    let iframe = document.createElement('iframe');
    document.body.append(iframe);
    window.alert = iframe.contentWindow.alert.bind(window);
    window.prompt = iframe.contentWindow.prompt.bind(window);
    iframe.remove();

    // 2. TRAP THE SCENE
    function withScene(callback) {
        if (window._SCENE && window._SCENE.sys && window._SCENE.sys.isActive()) {
            callback(window._SCENE);
            return;
        }
        let found = false;
        const originalUpdate = window.Phaser.Scenes.SceneManager.prototype.update;
        window.Phaser.Scenes.SceneManager.prototype.update = function(time, delta) {
            originalUpdate.call(this, time, delta);
            if (found) return;
            for (const scene of this.scenes) {
                if (scene.sys.isActive() && scene.sys.settings.key !== 'Boot') {
                    window._SCENE = scene;
                    found = true;
                    window.Phaser.Scenes.SceneManager.prototype.update = originalUpdate;
                    callback(scene);
                    return;
                }
            }
        };
    }

    // 3. EXECUTE CHEAT
    withScene((scene) => {
        const manager = scene.gameManager;

        if (!manager) {
            alert("❌ Game Manager not found!");
            return;
        }

        // Double check if property exists, otherwise check gameData fallback
        let healthTarget = manager;
        if (manager.health === undefined && scene.gameData && scene.gameData.health !== undefined) {
            healthTarget = scene.gameData;
        }

        const current = healthTarget.health;
        const input = prompt(`Current Health: ${current}\n\nEnter new health amount:`, "10000");
        
        if (input !== null) {
            const amount = parseInt(input);
            if (!isNaN(amount)) {
                healthTarget.health = amount;
                
                alert(`✅ Health set to ${amount}!\n\nNote: only changes the health that it shows if you take any damage.`);
            }
        }
    });
})();
