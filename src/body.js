class Body {
    constructor(x, y, r) {
        this.r = r;
        this.damp = 0.10;

        this.x = x;
        this.y = y;

        this.velocity = { x: 0, y: 0 };
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.velocity.x *= 1 - this.damp;
        this.velocity.y *= 1 - this.damp;
    }

    isColliding(x, y, r) {
        return dist(x, y, this.x, this.y) <= this.r + r;
    }

    isColliding(body) {
        return dist(body.x, body.y, this.x, this.y) <= this.r + body.r;
    }

    isColliding(body, error) {
        return dist(body.x, body.y, this.x, this.y) <= this.r + body.r + error;
    }
}