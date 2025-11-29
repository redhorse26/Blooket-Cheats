/**
 * Blooket - Percent Auto Answer (Press % to Answer)
 */

(() => {
    console.log("🧠 Percent Auto Answer Active (Press % to Answer)\n");
    
    const answerDatabase = {};
    let isAnswering = false; // Flag to trigger answering

    // LISTEN FOR PERCENT KEY (%)
    document.addEventListener('keydown', (e) => {
        if (e.key === '%') {
            console.log("⚡ % Pressed! Attempting to answer...");
            isAnswering = true;
            // Reset flag after short delay to prevent double clicks
            setTimeout(() => { isAnswering = false; }, 200);
        }
    });

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

    // 2. ALWAYS LEARN (Runs constantly)
    function learn() {
        const wrappers = document.querySelectorAll('[class*="questionWrapper"]');
        
        wrappers.forEach(wrapper => {
            const questionTextEl = wrapper.querySelector('[class*="questionText"]');
            if (!questionTextEl) return;

            const question = questionTextEl.textContent.trim();

            // --- CHECK 1: Multiple Choice ---
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
                        console.log(`✓ Learned (MC): "${question}" → "${answer}"`);
                    }
                }
            }

            // --- CHECK 2: Typing Questions ---
            const rawTypingEls = Array.from(wrapper.querySelectorAll('[class*="typingFeedbackAnswer"]'));
            
            const realTypingAnswers = rawTypingEls.filter(el => {
                const cls = el.getAttribute('class') || "";
                return !cls.includes('Answers') && !cls.includes('Icon');
            });

            if (realTypingAnswers.length > 0) {
                const answer = realTypingAnswers[0].textContent.trim();
                if (!answerDatabase[question]) {
                    answerDatabase[question] = [answer];
                    console.log(`✓ Learned (Typing): "${question}" → "${answer}"`);
                }
            }
        });
    }

    // 3. ANSWER ONLY ON TRIGGER
    function answer() {
        if (!isAnswering) return; // EXIT IF % NOT PRESSED

        const wrappers = document.querySelectorAll('[class*="questionWrapper"]');
        if (wrappers.length === 0) return;

        const activeWrapper = wrappers[wrappers.length - 1];
        const questionTextEl = activeWrapper.querySelector('[class*="questionText"]');
        if (!questionTextEl) return;

        const question = questionTextEl.textContent.trim();

        if (answerDatabase[question]) {
            const knownAnswer = answerDatabase[question][0];

            // --- MC Handling ---
            const buttons = activeWrapper.querySelectorAll('[class*="answerButton"]');
            if (buttons.length > 0) {
                for (const btn of buttons) {
                    const btnTextEl = btn.querySelector('[class*="answerText"]');
                    if (btnTextEl && btnTextEl.textContent.trim() === knownAnswer && !btn.className.includes('Disabled')) {
                        console.log(`🎯 Answering (MC): "${question}"`);
                        btn.click();
                        isAnswering = false; // Reset flag immediately after success
                        return;
                    }
                }
            }

            // --- Typing Handling ---
            const input = activeWrapper.querySelector('input[class*="typingAnswerInput"]');
            if (input && !input.disabled) {
                console.log(`🎯 Answering (Typing): "${question}" -> "${knownAnswer}"`);
                
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(input, knownAnswer);
                
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                
                setTimeout(() => {
                    const submitBtn = activeWrapper.querySelector('button[class*="typingAnswerButton"]');
                    if (submitBtn) submitBtn.click();
                    isAnswering = false; // Reset flag
                }, 50);
            }
        } else {
            console.log(`❓ Don't know answer for: "${question}" yet.`);
            isAnswering = false;
        }
    }

    setInterval(() => {
        autoContinue();
        learn();
        answer();
    }, 50);

    console.log("✅ Script Active. Press % to answer known questions.");
})();
