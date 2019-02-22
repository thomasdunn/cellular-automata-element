class Perf {
    constructor(options) {
        this.logEvery = options.logEvery || 0;
        this.frameStart = performance.now();

        this.reset();
    }

    reset() {
        // optimism!
        this.rollingMsPerFrame = 1000 / 60;

        this.tickCount = 0;
        this.frameStart = performance.now();
    }

    tick() {
        this.frameEnd = performance.now();

        const elapsedMs = this.frameEnd - this.frameStart;
        this.rollingMsPerFrame = 0.1 * elapsedMs + 0.9 * this.rollingMsPerFrame;

        this.frameStart = this.frameEnd;

        this.tickCount++;

        if (this.logEvery > 0 && this.tickCount % this.logEvery === 0) {
            console.log(`FPS ${this.fps}`);
        }
    }

    get fps() {
        return 1 / (this.rollingMsPerFrame / 1000);
    }

    get ticks() {
        return this.tickCount;
    }
}