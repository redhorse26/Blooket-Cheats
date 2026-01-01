(() => {
    console.log("🧠 Learn Auto Answer v3\n");

    const answerDatabase = {};

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
            const questionMedia = wrapper.querySelector('[class*="questionImage"]');
            if (!questionMedia) questionMedia = "none";
            const question = questionTextEl.textContent.trim()+ " " + questionMedia.src;

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

    function answer() {
        const wrappers = document.querySelectorAll('[class*="questionWrapper"]');
        if (wrappers.length === 0) return;

        let activeWrapper = wrappers[wrappers.length - 1];
        if (activeWrapper.className.includes('slideOut') && wrappers.length > 1) {

        }

        const questionTextEl = activeWrapper.querySelector('[class*="questionText"]');
        if (!questionTextEl) return;
        const questionMedia = activeWrapper.querySelector('[class*="questionImage"]');
        const question = questionTextEl.textContent.trim()+questionMedia.src;

        if (answerDatabase[question]) {
            const knownAnswer = answerDatabase[question][0];

            const buttons = activeWrapper.querySelectorAll('[class*="answerButton"]');
            if (buttons.length > 0) {
                for (const btn of buttons) {
                    const btnTextEl = btn.querySelector('[class*="answerText"]');

                    if (btnTextEl && btnTextEl.textContent.trim() === knownAnswer && !btn.className.includes('Disabled')) {
                        console.log(`🎯 Answering (MC): "${question}"`);
                        btn.click();
                        return;
                    }
                }
            }

            const input = activeWrapper.querySelector('input[class*="typingAnswerInput"]');
            if (input && !input.disabled) {

                if (input.value !== knownAnswer) {
                    console.log(`🎯 Typing: "${knownAnswer}"`);

                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    nativeInputValueSetter.call(input, knownAnswer);

                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }

                const submitBtn = activeWrapper.querySelector('button[class*="typingAnswerButton"]');
                if (submitBtn) {

                    if (!submitBtn._lastClick || Date.now() - submitBtn._lastClick > 200) {
                        console.log(`🎯 Submitting Typing...`);
                        submitBtn.click();
                        submitBtn._lastClick = Date.now();
                    }
                }
            }
        }
    }

    setInterval(() => {
        autoContinue();
        learn();
        answer();
    }, 50);

    console.log("✅ Script Active. Unblocked & Aggressive Typing.");
})();
