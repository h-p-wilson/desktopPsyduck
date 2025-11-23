// Movement functions for Psyduck
// This module handles all the movement logic and animations

// Move Psyduck down with optional distance limit and callback
function standStill(timeStandStill, onComplete) {
    const standStillFrames = [
        "walking_front2",
        "walking_back2", 
        "walking_left2",
        "walking_right2"
    ];
    let frameIndex = Math.random() % 5;
    setTimeout(timeStandStill);
    psyduck.className = standStillFrames[frameIndex];
    // Return a function to stop the animation manually
    if (onComplete) onComplete(); // Call the callback when done!
        return; // Stop the animation
    return () => {
        cancelAnimationFrame(animationId);
        console.log("Psyduck stopped manually!");
    };
}



// Move Psyduck down with optional distance limit and callback
function moveDown(maxDistance, onComplete) {
    const walkDownFrames = [
        "walking_front1",
        "walking_front2", 
        "walking_front3",
        "walking_front2"
    ];
    
    let frameIndex = 0;
    let animationId;
    let startY = y; // Remember where we started
    
    function animate() {
        // This shifts Psyduck down 1 px at a time
        y += 1;
        
        // Actually changes his position
        update();
        
        // Check if we've traveled far enough
        if (maxDistance && (y - startY) >= maxDistance) {
            cancelAnimationFrame(animationId);
            console.log(`Psyduck stopped after traveling ${y - startY} pixels!`);
            if (onComplete) onComplete(); // Call the callback when done!
            return; // Stop the animation
        }
        
        // Moves to the next frame every 8 steps
        if (y % 8 === 0) {
            psyduck.className = walkDownFrames[frameIndex];
            frameIndex = (frameIndex + 1) % walkDownFrames.length;
        }
        
        // Move onto the next frame
        animationId = requestAnimationFrame(animate);
    }
    
    // Start the animation
    animationId = requestAnimationFrame(animate);
    
    // Return a function to stop the animation manually
    return () => {
        cancelAnimationFrame(animationId);
        console.log("Psyduck stopped manually!");
    };
}

// Move Psyduck up with optional distance limit
function moveUp(maxDistance, onComplete) {
    const walkUpFrames = [
        "walking_back1",
        "walking_back2", 
        "walking_back3",
        "walking_back2"
    ];
    
    let frameIndex = 0;
    let animationId;
    let startY = y; // Remember where we started
    
    function animate() {
        // This shifts Psyduck up 1 px at a time
        y -= 1;
        
        // Actually changes his position
        update();
        
        // Check if we've traveled far enough (UP means startY - y, not y - startY!)
        if (maxDistance && (startY - y) >= maxDistance) {
            cancelAnimationFrame(animationId);
            console.log(`Psyduck stopped after traveling ${startY - y} pixels UP!`);
            if (onComplete) onComplete(); // Call the callback when done!
            return; // Stop the animation
        }
        
        // Moves to the next frame every 8 steps
        if (y % 8 === 0) {
            psyduck.className = walkUpFrames[frameIndex];
            frameIndex = (frameIndex + 1) % walkUpFrames.length;
        }
        
        // Move onto the next frame
        animationId = requestAnimationFrame(animate);
    }
    
    // Start the animation
    animationId = requestAnimationFrame(animate);
    
    // Return a function to stop the animation manually
    return () => {
        cancelAnimationFrame(animationId);
        console.log("Psyduck stopped manually!");
    };
}

// Move Psyduck right with optional distance limit
function moveRight(maxDistance, onComplete) {
    const walkRightFrames = [
        "walking_right1",
        "walking_right2", 
        "walking_right3",
        "walking_right2"
    ];
    
    let frameIndex = 0;
    let animationId;
    let startX = x; // Remember where we started
    
    function animate() {
        // This shifts Psyduck right 1 px at a time
        x += 1;
        
        // Actually changes his position
        update();
        
        // Check if we've traveled far enough (RIGHT means x - startX, not startX - x!)
        if (maxDistance && (x - startX) >= maxDistance) {
            cancelAnimationFrame(animationId);
            console.log(`Psyduck stopped after traveling ${x - startX} pixels RIGHT!`);
            if (onComplete) onComplete(); // Call the callback when done!
            return; // Stop the animation
        }
        
        // Moves to the next frame every 8 steps (check X not Y for horizontal movement!)
        if (x % 8 === 0) {
            psyduck.className = walkRightFrames[frameIndex];
            frameIndex = (frameIndex + 1) % walkRightFrames.length;
        }
        
        // Move onto the next frame
        animationId = requestAnimationFrame(animate);
    }
    
    // Start the animation
    animationId = requestAnimationFrame(animate);
    
    // Return a function to stop the animation manually
    return () => {
        cancelAnimationFrame(animationId);
        console.log("Psyduck stopped manually!");
    };
}

// Move Psyduck left with optional distance limit
function moveLeft(maxDistance, onComplete) {
    const walkLeftFrames = [
        "walking_left1",
        "walking_left2", 
        "walking_left3",
        "walking_left2"
    ];
    
    let frameIndex = 0;
    let animationId;
    let startX = x; // Remember where we started
    
    function animate() {
        // This shifts Psyduck left 1 px at a time
        x -= 1;
        
        // Actually changes his position
        update();
        
        // Check if we've traveled far enough (LEFT means startX - x, not x - startX!)
        if (maxDistance && (startX - x) >= maxDistance) {
            cancelAnimationFrame(animationId);
            console.log(`Psyduck stopped after traveling ${startX - x} pixels LEFT!`);
            if (onComplete) onComplete(); // Call the callback when done!
            return; // Stop the animation
        }
        
        // Moves to the next frame every 8 steps (check X not Y for horizontal movement!)
        if (x % 8 === 0) {
            psyduck.className = walkLeftFrames[frameIndex];
            frameIndex = (frameIndex + 1) % walkLeftFrames.length;
        }
        
        // Move onto the next frame
        animationId = requestAnimationFrame(animate);
    }
    
    // Start the animation
    animationId = requestAnimationFrame(animate);
    
    // Return a function to stop the animation manually
    return () => {
        cancelAnimationFrame(animationId);
        console.log("Psyduck stopped manually!");
    };
}
