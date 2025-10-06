/**
 * Blooket - Auto Answer (Fixed Learning)
 */

(() => {
    console.log("🧠 Smart Auto Answer (Fixed)\n");
    
    const answerDatabase = {};
    let currentQuestionText = "";
    
    // Learn from responses
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            const clonedResponse = response.clone();
            
            clonedResponse.text().then(text => {
                try {
                    // RSC format: lines starting with numbers
                    const lines = text.split('\n');
                    
                    for (const line of lines) {
                        // Look for the line with correctAnswers
                        if (line.includes('correctAnswers') && line.includes('nextQuestion')) {
                            console.log("Raw response line:", line);
                            
                            // Extract correctAnswers array
                            const correctMatch = line.match(/"correctAnswers":\[([^\]]+)\]/);
                            if (correctMatch) {
                                // Parse the answer array
                                const answersStr = correctMatch[1];
                                const answers = answersStr.match(/"([^"]+)"/g)
                                    ?.map(s => s.replace(/"/g, '')) || [];
                                
                                console.log("✓ Learned correct answers:", answers);
                                
                                // Extract next question text
                                const questionMatch = line.match(/"question":"([^"]+)"/);
                                if (questionMatch) {
                                    const nextQuestion = questionMatch[1];
                                    answerDatabase[nextQuestion] = answers;
                                    console.log(`  Stored for question: "${nextQuestion}"`);
                                    console.log(`  Total learned: ${Object.keys(answerDatabase).length}`);
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log("Parse error:", e.message);
                }
            });
            
            return response;
        });
    };
    
    console.log("✓ Fetch hook installed");
    
    // Create floating prompt
    let promptDiv = null;
    
    function showPrompt() {
        if (!promptDiv) {
            promptDiv = document.createElement('div');
            promptDiv.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #ff5555;
                color: white;
                padding: 20px 40px;
                border-radius: 10px;
                font-size: 24px;
                font-weight: bold;
                z-index: 999999;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                text-align: center;
            `;
            promptDiv.innerHTML = '⚠️ ANSWER THIS QUESTION<br>TO LEARN IT ⚠️';
            document.body.appendChild(promptDiv);
        }
        promptDiv.style.display = 'block';
    }
    
    function hidePrompt() {
        if (promptDiv) promptDiv.style.display = 'none';
    }
    
    // Auto-answer loop
    setInterval(() => {
        try {
            const answerButtons = Array.from(document.querySelectorAll("[class*='answerButton']"))
                .filter(btn => !btn.className.includes('Disabled'));
            
            const bodyText = document.body.textContent;
            
            // Check if on question screen
            if (answerButtons.length > 0 && 
                !bodyText.includes('CORRECT') && 
                !bodyText.includes('INCORRECT') &&
                !bodyText.includes('Press Anywhere')) {
                
                // Get all potential question texts
                const questionElements = Array.from(document.querySelectorAll("*"))
                    .filter(el => {
                        const text = el.textContent.trim();
                        return text.length > 5 && text.length < 200 && 
                               !text.includes('Settings') && !text.includes('Lvl');
                    });
                
                let foundAnswer = false;
                
                // Check if we know any of these questions
                for (const el of questionElements) {
                    const questionText = el.textContent.trim();
                    
                    if (answerDatabase[questionText]) {
                        const correctAnswers = answerDatabase[questionText];
                        console.log(`\n🎯 Known question: "${questionText}"`);
                        console.log("Correct answers:", correctAnswers);
                        
                        // Find matching button
                        for (const btn of answerButtons) {
                            const btnText = btn.textContent.trim();
                            if (correctAnswers.includes(btnText)) {
                                console.log(`✅ Clicking: "${btnText}"`);
                                btn.click();
                                foundAnswer = true;
                                hidePrompt();
                                break;
                            }
                        }
                        
                        if (foundAnswer) break;
                    }
                }
                
                // Show prompt if unknown
                if (!foundAnswer) {
                    showPrompt();
                }
                
            } else {
                hidePrompt();
            }
            
            // Auto-continue feedback
            if (bodyText.includes('Press Anywhere')) {
                const continueArea = document.querySelector("[class*='feedback']");
                if (continueArea) {
                    setTimeout(() => continueArea.click(), 300);
                }
            }
            
        } catch (e) {}
    }, 400);
    
    console.log("✅ Smart Auto Answer Active!");
    console.log("Answer questions manually - it will learn and auto-answer repeats!");
    console.log("\nTo check learned answers: window._answers");
    
    window._answers = answerDatabase;
})();
