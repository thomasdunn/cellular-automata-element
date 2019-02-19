class Cell {
    constructor(board, x, y, width, height) {
        this.g = new PIXI.Graphics();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.g.beginFill(0x000000);
        // this.g.lineStyle(0, 0xFF0000, 1);

        board.add(this);
    }

    draw() {
        this.g.drawRect(this.x, this.y, this.width, this.height);
    }

    getGraphics() {
        return this.g;
    }
}