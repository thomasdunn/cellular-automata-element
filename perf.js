export class Perf {
    constructor(options) {
        this.logEvery = options.logEvery || 0;
        this.logAtEnd = options.logAtEnd || true;
        this.frameStart = performance.now();
        this.snapshots = [];

        this.reset();
    }

    reset() {
        // optimism!
        this.rollingMsPerFrame = 1000 / 60;

        this.tickCount = 0;
        this.minMsPerFrame = Number.MAX_VALUE;
        this.maxMsPerFrame = Number.MIN_VALUE;
        this.frameStart = performance.now();
    }

    tick() {
        this.frameEnd = performance.now();

        const elapsedMs = this.frameEnd - this.frameStart;
        this.rollingMsPerFrame = 0.1 * elapsedMs + 0.9 * this.rollingMsPerFrame;

        this.frameStart = this.frameEnd;

        if (this.rollingMsPerFrame > this.maxMsPerFrame) {
            this.maxMsPerFrame = this.rollingMsPerFrame;
        }

        if (this.rollingMsPerFrame < this.minMsPerFrame) {
            this.minMsPerFrame = this.rollingMsPerFrame;
        }

        this.tickCount++;

        if (this.logEvery > 0 && this.tickCount % this.logEvery === 0) {
            this.snapshots.push(this.fps);
            console.log(`${this.fps.toFixed(1)} fps`);
        }
    }

    end() {
        if (this.logAtEnd) {
            const maxFps = 1 / (this.minMsPerFrame / 1000);
            const minFps = 1 / (this.maxMsPerFrame / 1000);
            console.log(`${this.averageFps().toFixed(1)} fps  [ ${minFps.toFixed(0)}-${maxFps.toFixed(0)} ]`);
        }
    }

    averageFps() {
        const reducer = (accum, current) => accum + current;
        const sum = this.snapshots.reduce(reducer, 0);
        return sum / this.snapshots.length;
    }

    get fps() {
        return 1 / (this.rollingMsPerFrame / 1000);
    }

    get ticks() {
        return this.tickCount;
    }
}