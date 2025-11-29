/**
 * Blooket - Subtle Highlight (Remove Shadow + Placeholder)
 */

(() => {
    console.log("🕵️ Subtle Highlight Active (Flat Button = Correct)\n");
    
    const answerDatabase = {};

    // 1. AUTOMATICALLY SKIP FEEDBACK
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

    // 2. LEARN ANSWERS
    function learn() {
        const wrappers = document.querySelectorAll('[class*="questionWrapper"]');
        
        wrappers.forEach(wrapper => {
            const questionTextEl = wrapper.querySelector('[class*="questionText"]');
            if (!questionTextEl) return;

            const question = questionTextEl.textContent.trim();

            // MC Check
            const correctBtn = Array.from(wrapper.querySelectorAll('[class*="answerButton"]')).find(btn => 
                btn.innerHTML.includes('fa-check') || 
                (btn.style.backgroundColor && btn.style.backgroundColor.includes('rgb(139, 220, 111)')) ||
                (btn.querySelector('[class*="answerFront"]') && btn.querySelector('[class*="answerFront"]').style.backgroundColor.includes('rgb(139, 220, 111)'))
            );

            if (correctBtn) {
                const answerTextEl = correctBtn.querySelector('[class*="answerText"]');
                if (answerTextEl) {
                    const answer = answerTextEl.textContent.trim();
                    if (!answerDatabase[question]) {
                        answerDatabase[question] = [answer];
                        console.log(`✓ Learned: "${question}" → "${answer}"`);
                    }
                }
            }

            // Typing Check
            const rawTypingEls = Array.from(wrapper.querySelectorAll('[class*="typingFeedbackAnswer"]'));
            const realTypingAnswers = rawTypingEls.filter(el => {
                const cls = el.getAttribute('class') || "";
                return !cls.includes('Answers') && !cls.includes('Icon');
            });

            if (realTypingAnswers.length > 0) {
                const answer = realTypingAnswers[0].textContent.trim();
                if (!answerDatabase[question]) {
                    answerDatabase[question] = [answer];
                    console.log(`✓ Learned: "${question}" → "${answer}"`);
                }
            }
        });
    }

    // 3. SUBTLE HIGHLIGHT
    function highlight() {
        const wrappers = document.querySelectorAll('[class*="questionWrapper"]');
        if (wrappers.length === 0) return;

        const activeWrapper = wrappers[wrappers.length - 1];
        if (activeWrapper.className.includes('slideOut')) return;

        const questionTextEl = activeWrapper.querySelector('[class*="questionText"]');
        if (!questionTextEl) return;

        const question = questionTextEl.textContent.trim();

        if (answerDatabase[question]) {
            const knownAnswer = answerDatabase[question][0];

            // --- MC: REMOVE SHADOW FROM CORRECT ANSWER ---
            const buttons = activeWrapper.querySelectorAll('[class*="answerButton"]');
            if (buttons.length > 0) {
                buttons.forEach(btn => {
                    const textEl = btn.querySelector('[class*="answerText"]');
                    if (!textEl) return;

                    const text = textEl.textContent.trim();
                    const back = btn.querySelector('[class*="answerBack"]');
                    
                    if (back) {
                        if (text === knownAnswer) {
                            // Correct Answer: Hide Shadow (make it "flat")
                            back.style.display = 'none'; 
                            // Or alternatively: back.style.opacity = '0';
                        } else {
                            // Wrong Answer: Ensure Shadow is visible (reset)
                            back.style.display = ''; 
                        }
                    }
                });
            }

            // --- TYPING: CHANGE PLACEHOLDER ONLY ---
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
