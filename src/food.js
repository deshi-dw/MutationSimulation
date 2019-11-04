class Food {
    constructor(x, y, worth = 300) {
        this.body = new Body(x, y, 10);
        this.worth = worth;
        this.isEaten = false;
    }

    eat() {
        this.isEaten = true;
        return this.worth;
    }

    draw() {
        noStroke();
        if (this.isEaten == false) {
            fill(200, 120, 10);
        } else {
            fill(130, 100, 100);
        }
        ellipse(this.body.x, this.body.y, 10, 10);
    }
}