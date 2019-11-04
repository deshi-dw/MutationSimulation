class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;

        this.scale = 0.5;
        this.sensitivity = 10;

        this.previousX = this.x;
        this.previousY = this.y;
    }

    pan(isPanning) {
        if (isPanning) {
            const accelX = mouseX - this.previousX;
            const accelY = mouseY - this.previousY;

            this.x += accelX;
            this.y += accelY;
        }

        this.previousX = mouseX;
        this.previousY = mouseY;

        translate(this.x, this.y);
    }

    zoom(isZooming) {
        if (isZooming) {
            this.scale = max(min(this.scale - mouseWheelY / this.sensitivity, 1), 0.1);
        }

        rectMode(CENTER);
        scale(sqrt(this.scale));
    }
}