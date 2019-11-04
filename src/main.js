let world;

let cam;

let mouseWheelY = 0;
let isScrolling = false;

function setup() {
    world = new World(5000, 5000, 100);
    createCanvas(displayWidth, displayHeight, P2D);
    frameRate(30);

    cam = new Camera();

    world.initialize();

}

function draw() {
    background(0);

    cam.pan(keyIsDown(32));
    cam.zoom(isScrolling);
    isScrolling = false;

    world.update();
    world.draw();

}

function mouseWheel(event) {
    mouseWheelY = event.delta;
    isScrolling = true;
}

// function mousePressed() {
//     world.foods.push(new Food(mouseX, mouseY));
// }