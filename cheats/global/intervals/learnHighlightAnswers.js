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
    console.log("🎨 Highlight Answers Active (Green = Correct, Red = Wrong)\n");
    
    if (!window.answerDatabase) {
        window.answerDatabase = {};
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
                    console.log(`✓ Learned (MC): "${question}" → "${answer}"`);
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
                    console.log(`✓ Learned (Typing): "${question}" → "${answer}"`);
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
                    
                    const front = btn.querySelector('[class*="answerFront"]');
                    const back = btn.querySelector('[class*="answerBack"]');
                    
                    const correctColor = '#00ff00';
                    const wrongColor = '#ff0000';

                    if (btnText === knownAnswer) {
                        if (front) {
                            front.style.backgroundColor = correctColor;
                            front.style.color = 'black';
                        }
                        if (back) back.style.backgroundColor = '#00cc00';
                    } else if (btnText) {
                        if (front) {
                            front.style.backgroundColor = wrongColor;
                            front.style.opacity = '0.7';
                        }
                        if (back) back.style.backgroundColor = '#cc0000';
                    }
                });
            }

            const input = activeWrapper.querySelector('input[class*="typingAnswerInput"]');
            if (input) {
                input.setAttribute('placeholder', `ANSWER: ${knownAnswer}`);
                
                const subHeader = activeWrapper.querySelector('[class*="typingAnswerSubheader"]');
                if (subHeader) {
                    subHeader.textContent = `ANSWER: ${knownAnswer}`;
                    subHeader.style.color = '#00ff00';
                    subHeader.style.fontWeight = 'bold';
                    subHeader.style.fontSize = '20px';
                }
            }
        }
    }

    setInterval(() => {
        autoContinue();
        learn();
        highlight();
    }, 100);

    console.log("✅ Highlighting Active. Play manually to populate database.");
})();
