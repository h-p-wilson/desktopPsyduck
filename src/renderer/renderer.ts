// ============================================================================
// 1. SETUP: Canvas and Context
// ============================================================================

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// Make canvas fill the entire window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ============================================================================
// 2. LOAD SPRITE SHEET
// ============================================================================

const spriteSheet = new Image();
spriteSheet.src =
	"/Users/hephzibahwilson/Documents/desktop-psyduck/dist/psyduck-sprite.png";

// ============================================================================
// 3. SIMPLE RENDER: Just draw the sprite sheet once
// ============================================================================

function render(): void {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw the entire sprite sheet at position (100, 100)
	ctx.drawImage(spriteSheet, 100, 100);
}

// ============================================================================
// 4. START
// ============================================================================

spriteSheet.onload = () => {
	console.log("Sprite sheet loaded!");
	render();
};

spriteSheet.onerror = () => {
	console.error("Failed to load sprite sheet at: " + spriteSheet.src);
};
