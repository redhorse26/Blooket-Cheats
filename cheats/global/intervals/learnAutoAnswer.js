(() => {
    console.log("🧠 Learn Auto Answer v3.1 (Fixed Math Trimming)\n");

    const answerDatabase = {};

    function autoContinue() {
        const feedbackContainer = document.querySelector('[class*="feedbackContainer"]');
        const feedbackText = document.querySelector('[class*="feedbackText"]');
        const isFeedback = feedbackContainer || (feedbackText && feedbackText.offsetParent !== null); 

        if (isFeedback) {
            if (feedbackContainer) feedbackContainer.click();
            else document.body.click();

            const event = new KeyboardEvent('keydown', {
                key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
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

                if (answer && !answerDatabase[question]) {
                    answerDatabase[question] = [answer];
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
        const questionTextEl = activeWrapper.querySelector('[class*="questionText"]');
        if (!questionTextEl) return;

        let questionMedia = activeWrapper.querySelector('[class*="questionImage"]');
        let qMediaSrc = questionMedia ? questionMedia.src : "none";
        let questionMath = activeWrapper.querySelector('[class*="mq-selectable"]');
        let qMathText = questionMath ? questionMath.innerText.trim() : "none";

        const question = questionTextEl.textContent.trim() + " " + qMediaSrc + " " + qMathText;

        if (answerDatabase[question]) {
            const knownAnswer = answerDatabase[question][0];

            const buttons = activeWrapper.querySelectorAll('[class*="answerButton"]');
            for (const btn of buttons) {
                const textEl = btn.querySelector('[class*="answerText"]');
                const mathEl = btn.querySelector('[class*="mq-selectable"]');
                const btnText = textEl ? textEl.textContent.trim() : (mathEl ? mathEl.innerText.trim() : "");

                if (btnText === knownAnswer && !btn.className.includes('Disabled')) {
                    console.log(`🎯 Answering (MC): "${question}"`);
                    btn.click();
                    return;
                }
            }

            const input = activeWrapper.querySelector('input[class*="typingAnswerInput"]');
            if (input && !input.disabled) {
                if (input.value !== knownAnswer) {
                    console.log(`🎯 Typing: "${knownAnswer}"`);
                    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    setter.call(input, knownAnswer);
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }

                const submitBtn = activeWrapper.querySelector('button[class*="typingAnswerButton"]');
                if (submitBtn && (!submitBtn._lastClick || Date.now() - submitBtn._lastClick > 200)) {
                    submitBtn.click();
                    submitBtn._lastClick = Date.now();
                }
            }
        }
    }

    setInterval(() => {
        autoContinue();
        learn();
        answer();
    }, 50);

    console.log("✅ Script Active.");
})();

