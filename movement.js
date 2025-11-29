let isMoving = false;
let lastCryTime = 0;
let cryCheckInterval;
let isMuted = false;

function playPsyduckCry(skipShake = false){
    if (!isMuted) {
        const audio = new Audio('assets/psyduck-cry.ogg');
        audio.volume = 0.3;
        audio.play().catch(e => {});
    }
    
    if (skipShake) {
        return;
    }
    
    const originalX = x;
    const originalY = y;
    const shakeIntensity = 1;
    const shakeDuration = 150;
    
    setTimeout(() => {
        y = originalY + shakeIntensity;
        update();
        
        setTimeout(() => {
            y = originalY - shakeIntensity;
            update();
            
            setTimeout(() => {
                y = originalY;
                update();
            }, shakeDuration / 2);
        }, shakeDuration / 2);
    }, 50);
}

function startMoving() {
    if (isMoving) return;
    isMoving = true;
    cryCheckInterval = setInterval(()=> {
        const now = performance.now();
        const timeSinceLastCry = now - lastCryTime;

        if (timeSinceLastCry > 20000 && Math.random()< 0.1) {
            playPsyduckCry();
            lastCryTime = now;
        }
    }, 500);
}

function stopMoving(){
    isMoving = false;
    if (cryCheckInterval) {
        clearInterval(cryCheckInterval);
        cryCheckInterval = null;
    }
}

function standStill(timeStandStill, onComplete) {
    stopMoving();
    isSleeping = true;
    const standStillFrames = ["sleeping1", "sleeping2"];
    let frameIndex = 0;
    let animationId;
    let lastFrameTime = performance.now();
    const startTime = performance.now();
    const frameDelay = 1200;
    
    function animate() {
        let currentTime = performance.now();
        let timePassed = currentTime - startTime;
        
        if (timePassed >= timeStandStill) {
            cancelAnimationFrame(animationId);
            isSleeping = false;
            if (onComplete) onComplete();
            return;
        }
        
        if (currentTime - lastFrameTime >= frameDelay) {
            psyduck.className = standStillFrames[frameIndex];
            frameIndex = (frameIndex + 1) % standStillFrames.length;
            lastFrameTime = currentTime;
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
        cancelAnimationFrame(animationId);
    };
}


function cheer(duration = 3000, onComplete) {
    stopMoving();
    const cheerFrames = ["cheering_1", "cheering_2"];
    let frameIndex = 0;
    let animationId;
    let lastFrameTime = performance.now();
    const startTime = performance.now();
    const frameDelay = 500; // Faster cheer animation
    

    
    function animate() {
        let currentTime = performance.now();
        let timePassed = currentTime - startTime;
        
        if (timePassed >= duration) {
            cancelAnimationFrame(animationId);
            if (onComplete) onComplete();
            return;
        }
        
        if (currentTime - lastFrameTime >= frameDelay) {
            psyduck.className = cheerFrames[frameIndex];
            frameIndex = (frameIndex + 1) % cheerFrames.length;
            lastFrameTime = currentTime;
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
        cancelAnimationFrame(animationId);
    };
}

function fall(duration = 2000, fallDistance = 0, onComplete) {
    stopMoving();
    const fallFrames = ["falling1", "falling2","falling3","falling4","falling5"]
    let frameIndex = 0;
    let animationId;
    let lastFrameTime = performance.now();
    const startTime = performance.now();
    // Calculate frame delay to spread frames evenly across the entire fall duration
    const frameDelay = duration / fallFrames.length; // One complete cycle through all frames
    
    // Store starting position for movement calculation
    const startY = y;
    const targetY = startY + fallDistance;
    let isLanded = false;



    function animate() {
        let currentTime = performance.now();
        let timePassed = currentTime - startTime;

        if (timePassed >= duration && !isLanded) {
            // Landing - start bounce effect
            isLanded = true;
            y = targetY; // Ensure exact landing position
            update();
            
            const bounceHeight = 15;
            const bounceDuration = 400;
            const bounceStart = performance.now();
            const landingY = y;
            
            function bounceAnimate() {
                const bounceElapsed = performance.now() - bounceStart;
                const bounceProgress = bounceElapsed / bounceDuration;
                
                if (bounceProgress >= 1) {
                    // Bounce complete
                    cancelAnimationFrame(animationId);
                    y = landingY; // Ensure back to ground
                    update();

                    
                    // Rest for a moment, then get up
                    setTimeout(() => {

                        
                        // Getting up animation - falling frames in reverse
                        const getUpFrames = [...fallFrames].reverse(); // ["falling5", "falling4", "falling3", "falling2", "falling1"]
                        const getUpDuration = 800; // 800ms to get up
                        const getUpFrameDelay = getUpDuration / getUpFrames.length;
                        const getUpStart = performance.now();
                        let getUpFrameIndex = 0;
                        let getUpLastFrameTime = performance.now();
                        
                        function getUpAnimate() {
                            const getUpElapsed = performance.now() - getUpStart;
                            
                            if (getUpElapsed >= getUpDuration) {
                                // Getting up complete
                                cancelAnimationFrame(animationId);

                                if (onComplete) onComplete();
                                return;
                            }
                            
                            // Update getting up frames
                            if (performance.now() - getUpLastFrameTime >= getUpFrameDelay) {
                                psyduck.className = getUpFrames[getUpFrameIndex];
                                getUpFrameIndex = (getUpFrameIndex + 1) % getUpFrames.length;
                                getUpLastFrameTime = performance.now();
                            }
                            
                            animationId = requestAnimationFrame(getUpAnimate);
                        }
                        
                        getUpAnimate();
                    }, 1000);
                    return;
                }
                
                // Bounce curve - up then down
                const bounceY = Math.sin(bounceProgress * Math.PI) * bounceHeight;
                y = landingY - bounceY;
                update();
                
                animationId = requestAnimationFrame(bounceAnimate);
            }
            
            bounceAnimate();
            return;
        }
        
        if (!isLanded) {
            // Update sprite frames during fall
            if (currentTime - lastFrameTime >= frameDelay) {
                psyduck.className = fallFrames[frameIndex];
                frameIndex = (frameIndex + 1) % fallFrames.length;
                lastFrameTime = currentTime;
            }
            
            // Update position if falling distance is specified
            if (fallDistance > 0) {
                const progress = timePassed / duration;
                y = startY + (fallDistance * progress);
                update();
            }
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
        cancelAnimationFrame(animationId);

    };
}

// Configuration-driven movement system
function createMovementFunction(config) {
    return function(maxDistance, onComplete) {
        startMoving();
        
        let frameIndex = 0;
        let animationId;
        const startPos = { x, y };
        let lastMoveTime = performance.now();
        let lastFrameTime = performance.now();
        const moveDelay = 80; // Move every 80ms for relaxed pace
        const frameDelay = 350; // Switch frames every 350ms
        
        // Immediately set the first frame to avoid bouncing on direction change
        psyduck.className = config.frames[0];
        
        function animate() {
            const currentTime = performance.now();
            
            // Only move at specific intervals for relaxed, consistent movement
            if (currentTime - lastMoveTime >= moveDelay) {
                // Calculate new position
                const newX = x + config.deltaX;
                const newY = y + config.deltaY;
                
                // Get window dimensions and Psyduck size (assuming ~20px width, ~24px height, scaled up)
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                const psyduckWidth = 40;  // Adjust if you change scale
                const psyduckHeight = 48; // Adjust if you change scale
                
                // Check boundaries and only move if within bounds
                if (newX >= 0 && newX <= windowWidth - psyduckWidth && 
                    newY >= 0 && newY <= windowHeight - psyduckHeight) {
                    x = newX;
                    y = newY;
                    update();
                    lastMoveTime = currentTime;
                } else {
                    // Hit boundary - stop this movement
                    cancelAnimationFrame(animationId);
                    stopMoving();

                    if (onComplete) onComplete('boundary');
                    return;
                }
                
                // Calculate distance using config's distance function
                const distance = config.calculateDistance(startPos, { x, y });
                
                if (maxDistance && distance >= maxDistance) {
                    cancelAnimationFrame(animationId);
                    stopMoving();

                    if (onComplete) onComplete('complete');
                    return;
                }
            }
            
            // Change animation frames at consistent intervals
            if (currentTime - lastFrameTime >= frameDelay) {
                psyduck.className = config.frames[frameIndex];
                frameIndex = (frameIndex + 1) % config.frames.length;
                lastFrameTime = currentTime;
            }
            
            animationId = requestAnimationFrame(animate);
        }
        
        animationId = requestAnimationFrame(animate);
        
        return () => {
            cancelAnimationFrame(animationId);
            stopMoving();

        };
    };
}

// Movement configurations
const MOVEMENT_CONFIGS = {
    down: {
        name: "DOWN",
        deltaX: 0, deltaY: 1,
        frames: ["walking_front1", "walking_front2", "walking_front3", "walking_front2"],
        calculateDistance: (start, current) => current.y - start.y
    },
    
    up: {
        name: "UP",
        deltaX: 0, deltaY: -1,
        frames: ["walking_back1", "walking_back2", "walking_back3", "walking_back2"],
        calculateDistance: (start, current) => start.y - current.y
    },
    
    right: {
        name: "RIGHT",
        deltaX: 1, deltaY: 0,
        frames: ["walking_right1", "walking_right2", "walking_right3", "walking_right2"],
        calculateDistance: (start, current) => current.x - start.x
    },
    
    left: {
        name: "LEFT",
        deltaX: -1, deltaY: 0,
        frames: ["walking_left1", "walking_left2", "walking_left3", "walking_left2"],
        calculateDistance: (start, current) => start.x - current.x
    },
    
    northEast: {
        name: "NE",
        deltaX: 1, deltaY: -1,
        frames: ["walking_ne1", "walking_ne2", "walking_ne3", "walking_ne2"],
        frameCondition: () => x % 16 === 0,
        calculateDistance: (start, current) => Math.max(
            Math.abs(current.x - start.x), 
            Math.abs(current.y - start.y)
        )
    },
    
    northWest: {
        name: "NW",
        deltaX: -1, deltaY: -1,
        frames: ["walking_nw1", "walking_nw2", "walking_nw3", "walking_nw2"],
        frameCondition: () => x % 16 === 0,
        calculateDistance: (start, current) => Math.max(
            Math.abs(start.x - current.x), 
            Math.abs(start.y - current.y)
        )
    },
    
    southEast: {
        name: "SE",
        deltaX: 1, deltaY: 1,
        frames: ["walking_se1", "walking_se2", "walking_se3", "walking_se2"],
        frameCondition: () => y % 16 === 0,
        calculateDistance: (start, current) => Math.max(
            Math.abs(current.x - start.x), 
            Math.abs(current.y - start.y)
        )
    },
    
    southWest: {
        name: "SW",
        deltaX: -1, deltaY: 1,
        frames: ["walking_sw1", "walking_sw2", "walking_sw3", "walking_sw2"],
        frameCondition: () => y % 16 === 0,
        calculateDistance: (start, current) => Math.max(
            Math.abs(start.x - current.x), 
            Math.abs(current.y - start.y)
        )
    }
};

// Generate movement functions
const moveDown = createMovementFunction(MOVEMENT_CONFIGS.down);
const moveUp = createMovementFunction(MOVEMENT_CONFIGS.up);
const moveRight = createMovementFunction(MOVEMENT_CONFIGS.right);
const moveLeft = createMovementFunction(MOVEMENT_CONFIGS.left);
const moveNorthEast = createMovementFunction(MOVEMENT_CONFIGS.northEast);
const moveNorthWest = createMovementFunction(MOVEMENT_CONFIGS.northWest);
const moveSouthEast = createMovementFunction(MOVEMENT_CONFIGS.southEast);
const moveSouthWest = createMovementFunction(MOVEMENT_CONFIGS.southWest);

// Make movement functions available globally for dynamic calling
window.moveDown = moveDown;
window.moveUp = moveUp;
window.moveRight = moveRight;
window.moveLeft = moveLeft;
window.moveNorthEast = moveNorthEast;
window.moveNorthWest = moveNorthWest;
window.moveSouthEast = moveSouthEast;
window.moveSouthWest = moveSouthWest;

function toggleMute() {
    isMuted = !isMuted;
    return isMuted;
}

function setMute(muted) {
    isMuted = muted;
    return isMuted;
}

function getMuteStatus() {
    return isMuted;
}

window.cheer = cheer;
window.standStill = standStill;
window.playPsyduckCry = playPsyduckCry;
window.fall = fall;
window.toggleMute = toggleMute;
window.setMute = setMute;
window.getMuteStatus = getMuteStatus;
