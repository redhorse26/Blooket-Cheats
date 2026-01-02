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
    console.log("🕵️ Subtle Highlight Active (Lighter Shadow = Correct)\n");
    
    if (!window.answerDatabase) {
        window.answerDatabase = {};
    }

    function lightenColor(color) {
        const rgb = color.match(/\d+/g);
        if (!rgb) return color;
        
        const r = Math.round(parseInt(rgb[0]) + (255 - parseInt(rgb[0])) * 0.1);
        const g = Math.round(parseInt(rgb[1]) + (255 - parseInt(rgb[1])) * 0.1);
        const b = Math.round(parseInt(rgb[2]) + (255 - parseInt(rgb[2])) * 0.1);
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    function autoContinue() {
        const feedbackContainer = document.querySelector('[class*="feedbackContainer"]');
        const feedbackText = document.querySelector('[class*="feedbackText"]');
        
        const isFeedback = feedbackContainer || 
                           (feedbackText && feedbackText.offsetParent !== null);

        if (isFeedback) {
            if (feedbackContainer) {
                feedbackContainer.click();
            } else {
                document.body.click();
            }
            
            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            });
            document.dispatchEvent(event);
        }
    }

    function learn() {
        const wrappers = document.querySelectorAll('[class*="questionWrapper"]');
        
        wrappers.forEach(wrapper => {
            const questionTextEl = wrapper.querySelector('[class*="questionText"]');
            if (!questionTextEl) return;

            let questionMedia = wrapper.querySelector('[class*="questionImage"]');
            let qMediaSrc = questionMedia ? questionMedia.src : "none";

            let questionMath = wrapper.querySelector('[class*="mq-selectable"]');
            let qMathText = questionMath ? questionMath.innerText.trim() : "none";

            const question = questionTextEl.textContent.trim() + " " + qMediaSrc + " " + qMathText;

            const correctBtn = Array.from(wrapper.querySelectorAll('[class*="answerButton"]')).find(btn => 
                btn.innerHTML.includes('fa-check') || 
                (btn.style.backgroundColor && btn.style.backgroundColor.includes('rgb(139, 220, 111)')) ||
                (btn.querySelector('[class*="answerFront"]') && btn.querySelector('[class*="answerFront"]').style.backgroundColor.includes('rgb(139, 220, 111)'))
            );

            if (correctBtn) {
                const textEl = correctBtn.querySelector('[class*="answerText"]');
                const mathEl = correctBtn.querySelector('[class*="mq-selectable"]');

                const answer = textEl ? textEl.textContent.trim() : (mathEl ? mathEl.innerText.trim() : null);

                if (answer && !window.answerDatabase[question]) {
                    window.answerDatabase[question] = [answer];
                    console.log(`✓ Learned: "${question}" → "${answer}"`);
                }
            }

            const rawTypingEls = Array.from(wrapper.querySelectorAll('[class*="typingFeedbackAnswer"]'));
            const realTypingAnswers = rawTypingEls.filter(el => {
                const cls = el.getAttribute('class') || "";
                return !cls.includes('Answers') && !cls.includes('Icon');
            });

            if (realTypingAnswers.length > 0) {
                const answer = realTypingAnswers[0].textContent.trim();
                if (!window.answerDatabase[question]) {
                    window.answerDatabase[question] = [answer];
                    console.log(`✓ Learned: "${question}" → "${answer}"`);
                }
            }
        });
    }

    function highlight() {
        const wrappers = document.querySelectorAll('[class*="questionWrapper"]');
        if (wrappers.length === 0) return;

        const activeWrapper = wrappers[wrappers.length - 1];
        if (activeWrapper.className.includes('slideOut')) return;

        const questionTextEl = activeWrapper.querySelector('[class*="questionText"]');
        if (!questionTextEl) return;

        let questionMedia = activeWrapper.querySelector('[class*="questionImage"]');
        let qMediaSrc = questionMedia ? questionMedia.src : "none";
        let questionMath = activeWrapper.querySelector('[class*="mq-selectable"]');
        let qMathText = questionMath ? questionMath.innerText.trim() : "none";

        const question = questionTextEl.textContent.trim() + " " + qMediaSrc + " " + qMathText;

        if (window.answerDatabase[question]) {
            const knownAnswer = window.answerDatabase[question][0];

            const buttons = activeWrapper.querySelectorAll('[class*="answerButton"]');
            if (buttons.length > 0) {
                buttons.forEach(btn => {
                    const textEl = btn.querySelector('[class*="answerText"]');
                    const mathEl = btn.querySelector('[class*="mq-selectable"]');
                    const btnText = textEl ? textEl.textContent.trim() : (mathEl ? mathEl.innerText.trim() : "");
                    
                    const back = btn.querySelector('[class*="answerBack"]');
                    
                    if (back && btnText === knownAnswer) {
                        const currentColor = window.getComputedStyle(back).backgroundColor;
                        back.style.backgroundColor = lightenColor(currentColor);
                    }
                });
            }

            const input = activeWrapper.querySelector('input[class*="typingAnswerInput"]');
            if (input) {
                input.setAttribute('placeholder', knownAnswer);
            }
        }
    }

    setInterval(() => {
        autoContinue();
        learn();
        highlight();
    }, 100);

    console.log("✅ Subtle Highlight Active.");
})();
