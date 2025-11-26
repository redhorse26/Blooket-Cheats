/**
 * Blooket - Auto Answer (Fixed Learning)
 */

(() => {
    console.log("🧠 Smart Auto Answer v3\n");
    
    const answerDatabase = {};
    let lastQuestionProcessed = "";
    let isProcessing = false;
    
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
        // Find question container
        const questionContainer = document.querySelector('[class*="questionContainer"]') ||
                                 document.querySelector('[class*="QuestionContainer"]');
        
        if (!questionContainer) return null;
        
        // Find question text inside
        const questionText = questionContainer.querySelector('[class*="questionText"]') ||
                            questionContainer.querySelector('[class*="QuestionText"]');
        
        if (questionText) {
            const text = questionText.textContent.trim();
            if (text.length > 0 && text.length < 500) {
                return text;
            }
        }
        
        return null;
    }
    
    // Auto-answer system
    function tryAutoAnswer() {
        if (isProcessing) return;
        
        try {
            // Check if question container exists
            const questionContainer = document.querySelector('[class*="questionContainer"]') ||
                                     document.querySelector('[class*="QuestionContainer"]');
            
            if (!questionContainer) {
                hidePrompt();
                lastQuestionProcessed = "";
                return;
            }
            
            // Get answer buttons
            const answerButtons = Array.from(document.querySelectorAll('[class*="answerButton"]'))
                .filter(btn => {
                    const classes = btn.className || "";
                    return !classes.includes('Disabled') && 
                           !classes.includes('disabled') &&
                           btn.offsetParent !== null; // visible
                });
            
            if (answerButtons.length === 0) {
                hidePrompt();
                return;
            }
            
            // Check if on feedback screen
            const bodyText = document.body.textContent;
            if (bodyText.includes('CORRECT') || 
                bodyText.includes('INCORRECT') || 
                bodyText.includes('Press Anywhere') ||
                bodyText.includes('Nice') ||
                bodyText.includes('Good')) {
                
                hidePrompt();
                lastQuestionProcessed = "";
                
                // Auto-continue
                const overlay = document.querySelector('[class*="feedback"]') ||
                              document.querySelector('[role="button"]');
                if (overlay && overlay.offsetParent !== null) {
                    setTimeout(() => overlay.click(), 200);
                }
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
                        
                        setTimeout(() => {
                            btn.click();
                            setTimeout(() => {
                                isProcessing = false;
                                lastQuestionProcessed = "";
                            }, 500);
                        }, 100);
                        
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
    
    // Run every 30ms
    setInterval(tryAutoAnswer, 30);
    
    console.log("✅ Auto Answer Active (30ms polling)");
    console.log("📚 Answer questions manually to learn them");
    console.log("🔍 Check: window._answers\n");
    
    window._answers = answerDatabase;
})();
