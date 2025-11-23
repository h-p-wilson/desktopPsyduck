// The bit we want to cut out for a frame
export interface Frame {
	x: number;
	y: number;
	w: number;
	h: number;
}

export class Animator {
	private currentFrameIndex = 0;
	private elapsedTime = 0;
	private frames: Frame[] = [];

	constructor(
		// The frames in a sequence
		frames: Frame[],
		// Time between frames in ms
		private frameIntervalMs: number = 100
	) {
		this.frames = frames;
	}

	// Get the current animation frame
	getCurrentFrame(): Frame {
		return this.frames[this.currentFrameIndex];
	}

	// Get the next frame of the animation and restarts at the end
	update(deltaTime: number): void {
		this.elapsedTime += deltaTime;
		if (this.elapsedTime >= this.frameIntervalMs) {
			this.elapsedTime = 0;
			this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
		}
	}

	// Change to a different animation
	setFrames(frames: Frame[]): void {
		this.frames = frames;
		this.currentFrameIndex = 0;
		this.elapsedTime = 0;
	}

	// Reset the animation to the first frame
	reset(): void {
		this.currentFrameIndex = 0;
		this.elapsedTime = 0;
	}
}
