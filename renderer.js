const psyduck = document.getElementById("psyduck");
const psyduckShadow = document.getElementById("psyduck-shadow");
let x = 100;
let y = 100;

let isWandering = false;
let isSleeping = false;
let wanderTimeoutId = null;
let currentAnimation = null;
let isFalling = false;
let shadowGroundY = 100; // Where the shadow stays during falls

function update() {
    psyduck.style.left = x + "px";
    psyduck.style.top = y + "px";
    
    // Position shadow - stays on ground during falls, follows Psyduck otherwise
    if (isFalling) {
        psyduckShadow.style.left = (x + 2) + "px";
        psyduckShadow.style.top = (shadowGroundY + 28) + "px";
    } else {
        psyduckShadow.style.left = (x + 2) + "px";
        psyduckShadow.style.top = (y + 28) + "px";
        shadowGroundY = y; // Update ground level when not falling
    }
}


function startBouncing() {
    function bounce() {
        moveDown(100);
        
        setTimeout(() => {
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
            moveRight(distance);
        } else if (step === 1) {
            moveDown(distance);
        } else if (step === 2) {
            moveLeft(distance);
        } else if (step === 3) {
            moveUp(distance);
        }
        
        step = (step + 1) % 4; 
        
        setTimeout(nextStep, 2000);
    }
    
    nextStep();
}
function moveRandomSquare() {
    let step = 0;
    
    function nextStep() {
        const randomDistance = 30 + Math.random() * 120;
        
        if (step === 0) {
            moveRight(randomDistance, nextStep);
        } else if (step === 1) {
            moveDown(randomDistance, nextStep);
        } else if (step === 2) {
            moveLeft(randomDistance, nextStep);
        } else if (step === 3) {
            moveUp(randomDistance, nextStep);
        } else if (step === 4) {
            const standTime = 3000 + Math.random() * 6000;
            standStill(standTime, () => {
                setTimeout(() => {
                    step = 0;
                    nextStep();
                }, 500);
            });
            return;
        }
        
        step = (step + 1) % 5;
    }
    
    nextStep();
}
function moveRandomDiamond() {
    let step = 0;
    
    function nextStep() {
        const randomDistance = 40 + Math.random() * 80;
        
        if (step === 0) {
            moveNorthEast(randomDistance, nextStep);
        } else if (step === 1) {
            moveSouthEast(randomDistance, nextStep);
        } else if (step === 2) {
            moveSouthWest(randomDistance, nextStep);
        } else if (step === 3) {
            moveNorthWest(randomDistance, nextStep);
        } else if (step === 4) {
            const standTime = 2500 + Math.random() * 4000;
            standStill(standTime, () => {
                setTimeout(() => {
                    step = 0;
                    nextStep();
                }, 300);
            });
            return;
        }
        
        step = (step + 1) % 5;
    }
    
    nextStep();
}

let lastDirection = null;

function stopWandering() {
    isWandering = false;
    if (wanderTimeoutId) {
        clearTimeout(wanderTimeoutId);
        wanderTimeoutId = null;
    }
    if (currentAnimation) {
        currentAnimation();
        currentAnimation = null;
    }
    stopMoving();

}

function startWandering() {
    if (isWandering) return;
    isWandering = true;
    wander();
}

function wander(){
    if (!isWandering) return;
    
    const shouldRest = Math.random() < 0.2;
    if (shouldRest) {
        const restTime = 2000 + Math.random() * 8000;
        currentAnimation = standStill(restTime, () => {
            if (!isWandering) return;
            lastDirection = null;
            currentAnimation = null;
            wander();
        });
    } else {
        const availableMovements = getAvailableMovements();
        let direction;
        if (lastDirection && Math.random() < 0.4) {
            const similarDirections = getSimilarDirections(lastDirection).filter(d => 
                availableMovements.includes(d)
            );
            if (similarDirections.length > 0) {
                direction = similarDirections[Math.floor(Math.random() * similarDirections.length)];
            }        }
        
        if (!direction) {
            direction = availableMovements[Math.floor(Math.random() * availableMovements.length)];
        }
        
        lastDirection = direction;
        
        let maxDistance = getMaxSafeDistance(direction);
        const distance = Math.min(40 + Math.random() * 120, maxDistance);
        
        currentAnimation = window[`move${direction}`](distance, (reason) => {
            if (!isWandering) return;
            currentAnimation = null;
            if (reason === 'boundary') {
                lastDirection = null;
            }
            const delay = reason === 'boundary' ? 1000 + Math.random() * 2000 : 300 + Math.random() * 1500;
            wanderTimeoutId = setTimeout(wander, delay);
        });
    }
}
function getSimilarDirections(direction) {
    const directionGroups = {
        'Up': ['Up', 'NorthEast', 'NorthWest'],
        'Down': ['Down', 'SouthEast', 'SouthWest'],
        'Left': ['Left', 'NorthWest', 'SouthWest'],
        'Right': ['Right', 'NorthEast', 'SouthEast'],
        'NorthEast': ['NorthEast', 'Up', 'Right'],
        'NorthWest': ['NorthWest', 'Up', 'Left'],
        'SouthEast': ['SouthEast', 'Down', 'Right'],
        'SouthWest': ['SouthWest', 'Down', 'Left']
    };
    
    return directionGroups[direction] || [];
}
function getAvailableMovements() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const psyduckWidth = 40;
    const psyduckHeight = 48;
    const margin = 50; // Minimum distance from edge to consider a direction
    
    const movements = [];
    
    if (x > margin) movements.push('Left', 'Left');
    if (x < windowWidth - psyduckWidth - margin) movements.push('Right', 'Right');
    if (y > margin) movements.push('Up', 'Up');
    if (y < windowHeight - psyduckHeight - margin) movements.push('Down', 'Down');
    
    if (x > margin && y > margin) movements.push('NorthWest');
    if (x < windowWidth - psyduckWidth - margin && y > margin) movements.push('NorthEast');
    if (x > margin && y < windowHeight - psyduckHeight - margin) movements.push('SouthWest');
    if (x < windowWidth - psyduckWidth - margin && y < windowHeight - psyduckHeight - margin) movements.push('SouthEast');
    
    if (movements.length === 0) {
        return ['Down', 'Up', 'Right', 'Left', 'NorthEast', 'NorthWest', 'SouthEast', 'SouthWest'];
    }
    
    return movements;
}
function getMaxSafeDistance(direction) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const psyduckWidth = 40;
    const psyduckHeight = 48;
    
    switch(direction) {
        case 'Left': return Math.max(10, x - 10);
        case 'Right': return Math.max(10, windowWidth - psyduckWidth - x - 10);
        case 'Up': return Math.max(10, y - 10);
        case 'Down': return Math.max(10, windowHeight - psyduckHeight - y - 10);
        case 'NorthWest': return Math.max(10, Math.min(x - 10, y - 10));
        case 'NorthEast': return Math.max(10, Math.min(windowWidth - psyduckWidth - x - 10, y - 10));
        case 'SouthWest': return Math.max(10, Math.min(x - 10, windowHeight - psyduckHeight - y - 10));
        case 'SouthEast': return Math.max(10, Math.min(windowWidth - psyduckWidth - x - 10, windowHeight - psyduckHeight - y - 10));
        default: return 100; // Fallback
    }
}


function fallingIn() {
    x = 200 + Math.random() * (window.innerWidth - 400);
    y = -80;
    
    stopWandering();
    
    const landingDistance = 200 + Math.random() * 150;
    shadowGroundY = y + landingDistance; // Set where shadow will appear on ground
    isFalling = true;
    
    update();
    
    fall(2000, landingDistance, () => {
        isFalling = false; // Shadow now follows Psyduck again
        setTimeout(() => {
            cheer(1500, () => {
                startWandering();
            });
        }, 400);
    });
}

// startBouncing(); 
// moveSquare();       
// moveRandomSquare();      
// moveRandomDiamond();      
// startWandering();

fallingIn();
function setupPsyduckClick() {
    let isClickable = false;
    
    // Mouse enter/leave handlers to control click-through behavior
    psyduck.addEventListener('mouseenter', () => {
        if (window.electronAPI) {
            isClickable = true;
            // Disable click-through when hovering over Psyduck
            window.electronAPI.setIgnoreMouseEvents(false);
        }
    });
    
    psyduck.addEventListener('mouseleave', () => {
        if (window.electronAPI && isClickable) {
            isClickable = false;
            window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
        }
    });
    psyduck.addEventListener('click', (event) => {
        if (isSleeping) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        
        stopWandering();
        
        playPsyduckCry(true);
        
        currentAnimation = cheer(3000, () => {
            currentAnimation = null;
            setTimeout(() => {
                startWandering();
            }, 500);
        });
    });
}

document.addEventListener('DOMContentLoaded', setupPsyduckClick);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPsyduckClick);
} else {
    setupPsyduckClick();
}

function setupMenu() {
    const appleMenu = document.getElementById('apple-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const muteButton = document.getElementById('mute-button');
    const closeButton = document.getElementById('close-button');
    const cancelButton = document.getElementById('cancel-button');
    const loudred = document.getElementById('loudred');
    
    function showMenu() {
        menuOverlay.style.display = 'flex';
        updateMuteButton();
    }
    
    function hideMenu() {
        menuOverlay.style.display = 'none';
        if (window.electronAPI) {
            window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
        }
    }
    
    function updateMuteButton() {
        const isMuted = getMuteStatus();
        muteButton.textContent = isMuted ? 'Unmute Sound' : 'Mute Sound';
        muteButton.classList.toggle('muted', isMuted);
        
        // Update Loudred animation based on mute status
        if (loudred) {
            if (isMuted) {
                loudred.classList.add('loudred-sleeping');
            } else {
                loudred.classList.remove('loudred-sleeping');
            }
        }
    }
    
    appleMenu.addEventListener('mouseenter', () => {
        if (window.electronAPI) {
            window.electronAPI.setIgnoreMouseEvents(false);
        }
    });
    
    appleMenu.addEventListener('mouseleave', () => {
        if (window.electronAPI) {
            window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
        }
    });
    
    appleMenu.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        showMenu();
    });
    
    muteButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleMute();
        updateMuteButton();
    });
    
    closeButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (window.electronAPI && window.electronAPI.closeApp) {
            window.electronAPI.closeApp();
        } else {
            window.close();
        }
    });
    
    cancelButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        hideMenu();
    });
    
    const menuPanel = document.querySelector('.menu-panel');
    
    // Use the same mouse enter/leave approach as Psyduck
    menuOverlay.addEventListener('mouseenter', () => {
        if (window.electronAPI) {
            window.electronAPI.setIgnoreMouseEvents(false);
        }
    });
    
    menuOverlay.addEventListener('mouseleave', () => {
        if (window.electronAPI) {
            window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
        }
    });
    
    menuPanel.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    
    menuOverlay.addEventListener('click', (event) => {
        if (event.target === menuOverlay) {
            hideMenu();
        }
    });
    
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            hideMenu();
        }
    });
}

document.addEventListener('DOMContentLoaded', setupMenu);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMenu);
} else {
    setupMenu();
}