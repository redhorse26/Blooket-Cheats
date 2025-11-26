/**
 * Blooket - Learn Auto Answer (Ultra Fast)
 */

(() => {
    console.log("🧠 Learn Auto Answer v4 (ULTRA FAST)\n");
    
    const answerDatabase = {};
    let lastQuestionProcessed = "";
    let isProcessing = false;
    let lastFeedbackClick = 0;
    
    // Learn from responses
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            const clonedResponse = response.clone();
            
            clonedResponse.text().then(text => {
                try {
                    const lines = text.split('\n');
                    
                    for (const line of lines) {
                        if (line.includes('correctAnswers') && line.includes('question')) {
                            // Extract correctAnswers array
                            const correctMatch = line.match(/"correctAnswers":\s*\[([^\]]*)\]/);
                            if (correctMatch) {
                                const answersStr = correctMatch[1];
                                const answers = [];
                                
                                // Parse answer strings
                                const answerMatches = answersStr.matchAll(/"([^"]+)"/g);
                                for (const match of answerMatches) {
                                    answers.push(match[1]);
                                }
                                
                                // Extract current question
                                const questionMatch = line.match(/"question"\s*:\s*"([^"]+)"/);
                                if (questionMatch && answers.length > 0) {
                                    const question = questionMatch[1];
                                    answerDatabase[question] = answers;
                                    console.log(`✓ Learned: "${question}" → [${answers.join(', ')}]`);
                                    console.log(`  Total: ${Object.keys(answerDatabase).length} questions`);
                                }
                            }
                        }
                    }
                } catch (e) {}
            });
            
            return response;
        });
    };
    
    console.log("✓ Learning system active");
    
    // Prompt overlay
    let promptDiv = null;
    
    function showPrompt() {
        if (!promptDiv) {
            promptDiv = document.createElement('div');
            promptDiv.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #ff5555, #ff3333);
                color: white;
                padding: 15px 35px;
                border-radius: 12px;
                font-size: 20px;
                font-weight: bold;
                z-index: 999999;
                box-shadow: 0 6px 25px rgba(255,0,0,0.4);
                text-align: center;
                animation: pulse 1.5s ease-in-out infinite;
            `;
            promptDiv.innerHTML = '⚠️ ANSWER TO LEARN ⚠️';
            
            // Add pulse animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: translateX(-50%) scale(1); }
                    50% { transform: translateX(-50%) scale(1.05); }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(promptDiv);
        }
        promptDiv.style.display = 'block';
    }
    
    function hidePrompt() {
        if (promptDiv) promptDiv.style.display = 'none';
    }
    
    // Get current question text
    function getCurrentQuestion() {
        const questionContainer = document.querySelector('[class*="question"]');
        
        if (!questionContainer) return null;
        
        const questionText = questionContainer.querySelector('[class*="Text"]') ||
                            questionContainer.querySelector('div[style*="font-size"]');
        
        if (questionText) {
            const text = questionText.textContent.trim();
            if (text.length > 0 && text.length < 500) {
                return text;
            }
        }
        
        return null;
    }
    
    // Auto-answer system (ULTRA FAST)
    function tryAutoAnswer() {
        if (isProcessing) return;
        
        try {
            const bodyText = document.body.textContent;
            
            // Check for "Press Anywhere" text
            if (bodyText.includes('Press Anywhere')) {
                const now = Date.now();
                if (now - lastFeedbackClick < 500) return;
                
                lastFeedbackClick = now;
                
                // Try multiple continue methods
                const feedbackEl = document.querySelector('[class*="feedback"]') ||
                                  document.querySelector('[class*="Feedback"]') ||
                                  Array.from(document.querySelectorAll('div')).find(el => 
                                      el.textContent.includes('Press Anywhere')
                                  );
                
                if (feedbackEl) {
                    feedbackEl.click();
                }
                
                // Click body
                document.body.click();
                
                // Press Enter
                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(enterEvent);
                
                const enterUpEvent = new KeyboardEvent('keyup', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(enterUpEvent);
                
                // Press Space
                const spaceEvent = new KeyboardEvent('keydown', {
                    key: ' ',
                    code: 'Space',
                    keyCode: 32,
                    which: 32,
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(spaceEvent);
                
                hidePrompt();
                lastQuestionProcessed = "";
                return;
            }
            
            // Check if question container exists
            const questionContainer = document.querySelector('[class*="question"]');
            
            if (!questionContainer) {
                hidePrompt();
                lastQuestionProcessed = "";
                return;
            }
            
            // Get answer buttons
            const answerButtons = Array.from(document.querySelectorAll('[class*="answer"]'))
                .filter(btn => {
                    const classes = btn.className || "";
                    return !classes.toLowerCase().includes('disabled') &&
                           btn.offsetParent !== null;
                });
            
            if (answerButtons.length === 0) {
                hidePrompt();
                return;
            }
            
            // Check if on feedback screen
            if (bodyText.includes('CORRECT') || 
                bodyText.includes('INCORRECT') || 
                bodyText.includes('Nice') ||
                bodyText.includes('Good')) {
                
                hidePrompt();
                lastQuestionProcessed = "";
                return;
            }
            
            // Get current question
            const question = getCurrentQuestion();
            
            if (!question) {
                hidePrompt();
                return;
            }
            
            // Prevent double-processing same question
            if (question === lastQuestionProcessed) {
                return;
            }
            
            // Check if we know this question
            if (answerDatabase[question]) {
                const correctAnswers = answerDatabase[question];
                console.log(`\n🎯 Auto-answering: "${question}"`);
                console.log(`   Correct: [${correctAnswers.join(', ')}]`);
                
                isProcessing = true;
                lastQuestionProcessed = question;
                
                // Find matching button
                for (const btn of answerButtons) {
                    const btnText = btn.textContent.trim();
                    
                    if (correctAnswers.includes(btnText)) {
                        console.log(`   ✅ Clicking: "${btnText}"`);
                        hidePrompt();
                        
                        btn.click();
                        
                        setTimeout(() => {
                            isProcessing = false;
                            lastQuestionProcessed = "";
                        }, 200);
                        
                        return;
                    }
                }
                
                console.log(`   ⚠️ Correct answer not found in buttons`);
                isProcessing = false;
            } else {
                // Unknown question
                if (question !== lastQuestionProcessed) {
                    console.log(`\n❓ Unknown: "${question}"`);
                    lastQuestionProcessed = question;
                    showPrompt();
                }
            }
            
        } catch (e) {
            isProcessing = false;
        }
    }
    
    // Run every 10ms
    setInterval(tryAutoAnswer, 10);
    
    console.log("✅ ULTRA FAST Auto Answer Active (10ms polling)");
    console.log("📚 Answer questions manually to learn them");
    console.log("🔍 Check: window._answers\n");
    
    window._answers = answerDatabase;
})();
