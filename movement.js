// Movement functions for Psyduck
// This module handles all the movement logic and animations

let isMoving = false;
let lastCryTime = 0;
let cryCheckInterval;

function playPsyduckCry(){
    const audio = new Audio('assets/psyduck-cry.ogg');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio failed ', e));
}

function startMoving() {
    if (isMoving) return;
    isMoving = true;
    cryCheckInterval = setInterval(()=> {
        const now = performance.now();
        const timeSinceLastCry = now - lastCryTime;

        if (timeSinceLastCry > 10000 && Math.random()< 0.1) {
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
    const standStillFrames = ["sleeping1", "sleeping2"];
    let frameIndex = 0;
    let animationId;
    let lastFrameTime = performance.now();
    const startTime = performance.now();
    const frameDelay = 1200; // Slower, more peaceful sleep animation
    
    function animate() {
        let currentTime = performance.now();
        let timePassed = currentTime - startTime;
        
        if (timePassed >= timeStandStill) {
            cancelAnimationFrame(animationId);
            console.log(`Psyduck woke up after ${Math.round(timePassed)} ms!`);
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
        console.log("Psyduck stopped manually!");
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
                x += config.deltaX;
                y += config.deltaY;
                update();
                lastMoveTime = currentTime;
                
                // Calculate distance using config's distance function
                const distance = config.calculateDistance(startPos, { x, y });
                
                if (maxDistance && distance >= maxDistance) {
                    cancelAnimationFrame(animationId);
                    stopMoving();
                    console.log(`Psyduck stopped after traveling ${Math.round(distance)} pixels ${config.name}!`);
                    if (onComplete) onComplete();
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
            console.log("Psyduck stopped manually!");
        };
    };
}

// Movement configurations
const MOVEMENT_CONFIGS = {
    down: {
        name: "",
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
