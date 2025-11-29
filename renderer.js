// To see logging I need to open the dev tools using cmd+option+i
// Psyduck animation
const psyduck = document.getElementById("psyduck");
let x = 100;
let y = 100;

function update() {
    psyduck.style.left = x + "px";
    psyduck.style.top = y + "px";
}

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
        
        step = (step + 1) % 4; 
        
        setTimeout(nextStep, 2000);
    }
    
    nextStep(); // Start!
}

// A random distance square
function moveRandomSquare() {
    let step = 0;
    
    function nextStep() {
        // Random distance between 30 and 150 pixels
        const randomDistance = 30 + Math.random() * 120;
        
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
            moveUp(randomDistance, nextStep); // When done, call nextStep!
        } else if (step === 4) {
            const standTime = 3000 + Math.random() * 6000; // 3-9 seconds for relaxing rest
            console.log(`💤 Sleeping for ${Math.round(standTime)}ms`);
            standStill(standTime, () => {
                // Wait a moment, then start again
                setTimeout(() => {
                    console.log("Random square complete! Starting new one...");
                    step = 0;
                    nextStep();
                }, 500);
            });
            return; // Don't increment step here, we reset it in the callback
        }
        
        step = (step + 1) % 5;
    }
    
    nextStep(); // Start!
}

// A random distance diamond
function moveRandomDiamond() {
    let step = 0;
    
    function nextStep() {
        // Random distance between 40 and 120 pixels 
        const randomDistance = 40 + Math.random() * 80;
        
        if (step === 0) {
            console.log(`↗ NorthEast ${Math.round(randomDistance)}px`);
            moveNorthEast(randomDistance, nextStep);
        } else if (step === 1) {
            console.log(`↘ SouthEast ${Math.round(randomDistance)}px`);
            moveSouthEast(randomDistance, nextStep);
        } else if (step === 2) {
            console.log(`↙ SouthWest ${Math.round(randomDistance)}px`);
            moveSouthWest(randomDistance, nextStep);
        } else if (step === 3) {
            console.log(`↖ NorthWest ${Math.round(randomDistance)}px`);
            moveNorthWest(randomDistance, nextStep);
        } else if (step === 4) {
            const standTime = 2500 + Math.random() * 4000; // 2.5 - 6.5 seconds for relaxing rest
            console.log(`💎 Diamond complete! Resting for ${Math.round(standTime)}ms`);
            standStill(standTime, () => {
                // Wait a moment, then start a new diamond
                setTimeout(() => {
                    console.log("Starting new diamond pattern...");
                    step = 0;
                    nextStep();
                }, 300);
            });
            return; // Don't increment step here, we reset it in the callback
        }
        
        step = (step + 1) % 5;
    }
    
    nextStep(); // Start the diamond!
}

// Choose one to run:
// startBouncing(); 
// moveSquare();       
// moveRandomSquare();      
moveRandomDiamond();      