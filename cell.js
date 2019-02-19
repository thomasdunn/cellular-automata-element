class Cell {
    constructor(board, xIndex, yIndex) {
        this.g = new PIXI.Graphics();
        this.i = xIndex;
        this.j = yIndex;

        this.on();

        board.add(this);
    }

    draw() {
        this.g.clear();

        const fill = this.active ? 0x000000 : 0xFFFFFF;
        this.g.beginFill(fill);
        // this.g.lineStyle(0, 0xFF0000, 1);

        this.g.drawRect(this.i * Cell.width, this.j * Cell.height, Cell.width, Cell.height);
        return this;
    }

    on() {
        this.active = true;
        return this;
    }

    off() {
        this.active = false;
        return this;
    }

    toggle() {
        this.active = ! this.active;
        return this;
    }

    static size(width, height) {
        Cell.width = width;
        Cell.height = height;
    }

    getGraphics() {
        return this.g;
    }
}