// To see logging I need to open the dev tools using cmd+option+i
// Psyduck animation
const psyduck = document.getElementById("psyduck");
let x = 100;
let y = 100;

function update() {
    psyduck.style.left = x + "px";
    psyduck.style.top = y + "px";
}

// Movement functions are now in movement.js

// Wee up and down example
function startBouncing() {
    function bounce() {
        console.log("Moving down...");
        moveDown(100);
        
        setTimeout(() => {
            console.log("Moving up...");
            moveUp(100);
            
            setTimeout(bounce, 2000);
        }, 2000);
    }
    bounce();
}

function moveSquare() {
    let step = 0;
    const distance = 100;
    
    function nextStep() {
        if (step === 0) {
            console.log("→ Right");
            moveRight(distance);
        } else if (step === 1) {
            console.log("↓ Down"); 
            moveDown(distance);
        } else if (step === 2) {
            console.log("← Left");
            moveLeft(distance);
        } else if (step === 3) {
            console.log("↑ Up");
            moveUp(distance);
        }
        
        step = (step + 1) % 4; // 0,1,2,3,0,1,2,3...
        
        // Wait long enough for movement to finish (100px ÷ 1px/frame × 16ms/frame = ~1600ms + buffer)
        setTimeout(nextStep, 2000);
    }
    
    nextStep(); // Start!
}

// RANDOM DISTANCE SQUARE - No more hardcoded timeouts!
function moveRandomSquare() {
    let step = 0;
    
    function nextStep() {
        // Random distance between 30 and 150 pixels
        const randomDistance = 0 + Math.random() * 150;
        
        if (step === 0) {
            console.log(`→ Right ${Math.round(randomDistance)}px`);
            moveRight(randomDistance, nextStep); // When done, call nextStep!
        } else if (step === 1) {
            console.log(`↓ Down ${Math.round(randomDistance)}px`); 
            moveDown(randomDistance, nextStep); // When done, call nextStep!
        } else if (step === 2) {
            console.log(`← Left ${Math.round(randomDistance)}px`);
            moveLeft(randomDistance, nextStep); // When done, call nextStep!
        } else if (step === 3) {
            console.log(`↑ Up ${Math.round(randomDistance)}px`);
            moveUp(randomDistance, () => {
                // Square complete! Wait a moment, then start again
                setTimeout(() => {
                    console.log("Random square complete! Starting new one...");
                    step = 0;
                    const stopOrContinue = r
                    nextStep();
                }, 500);
            });
            return; // Don't increment step here, we do it in the callback
        }
        
        step = (step + 1) % 4; // Move to next direction
    }
    
    nextStep(); // Start!
}

// Choose one to run:
// startBouncing(); 
// moveSquare();         // Fixed square with hardcoded timeouts
moveRandomSquare();      // Random distance square with callbacks!

