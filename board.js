class Board {
    constructor(renderer, stage) {
        this.renderer = renderer;
        this.stage = stage;
    }

    add(actor) {
        this.stage.addChild(actor.getGraphics());
    }

    render() {
        this.renderer.render(this.stage);
    }
}