class Agent {
    constructor(x, y, health, parent, world) {
        this.world = world;
        this.tickCount = 0;
        this.body = new Body(x, y, 10);
        this.direction = 0;
        this.state = {
            roam: true,
            seen_food: false,
            targetFood: -1,
            targetFoodPosition: { x: 0, y: 0 }
        };

        this.health = health;
        this.isDead = false;

        this.lifeDecay = 0.5;
        this.moveDecay = 5;
        this.searchDecay = 1;

        this.directionChangeRate = random(20, 200);

        this.sight = 100;
        this.sightWidth = radians(40);

        this.foodSearchRate = random(1, 100);;

        this.moveSpeed = random(0.1, 5);
        this.moveRate = random(10, 200);

        this.birthHealthMin = random(1, 50000);
        this.birthSplitPercent = random(0.001, 0.9999);
        this.birthRate = random(0, 1000);

        if (parent != null) {
            this.directionChangeRate = parent.directionChangeRate + parent.directionChangeRate * random(-world.mutationPercent, parent.directionChangeRate);
            this.sightWidth = parent.sightWidth + parent.sightWidth * random(-world.mutationPercent, parent.sightWidth);
            this.foodSearchRate = parent.foodSearchRate + parent.foodSearchRate * random(-world.mutationPercent, parent.foodSearchRate);
            this.moveSpeed = parent.moveSpeed + parent.moveSpeed * random(-world.mutationPercent, parent.moveSpeed);
            this.moveRate = parent.moveRate + parent.moveRate * random(-world.mutationPercent, parent.moveRate);
            this.birthHealthMin = parent.birthHealthMin + parent.birthHealthMin * random(-world.mutationPercent, parent.birthHealthMin);
            this.birthSplitPercent = parent.birthSplitPercent + parent.birthSplitPercent * random(-world.mutationPercent, parent.birthSplitPercent);
            this.birthRate = parent.birthRate + parent.birthRate * random(-world.mutationPercent, parent.birthRate);
        }
    }

    move() {
        this.body.velocity.x += cos(this.direction) * this.moveSpeed;
        this.body.velocity.y += sin(this.direction) * this.moveSpeed;

        if (this.body.x > this.world.bounds.maxX) {
            this.body.x = this.world.bounds.minX + 1;
        } else if (this.body.y > this.world.bounds.maxY) {
            this.body.y = this.world.bounds.minY + 1;
        } else if (this.body.x < this.world.bounds.minX) {
            this.body.x = this.world.bounds.maxX - 1;
        } else if (this.body.y < this.world.bounds.minY) {
            this.body.y = this.world.bounds.maxY - 1;
        }

        this.health -= this.moveDecay * (this.moveSpeed / 5 + 1);
    }

    moveToFood() {
        const distance = dist(this.state.targetFoodPosition.x, this.state.targetFoodPosition.y, this.body.x, this.body.y);
        const speed = (this.body.damp * this.body.damp) * (distance + 1) * this.moveSpeed;
        this.body.velocity.x += cos(this.direction) * speed;
        this.body.velocity.y += sin(this.direction) * speed;

        if (this.body.x > this.world.bounds.maxX) {
            this.body.x = this.world.bounds.minX + 1;
        } else if (this.body.y > this.world.bounds.maxY) {
            this.body.y = this.world.bounds.minY + 1;
        } else if (this.body.x < this.world.bounds.minX) {
            this.body.x = this.world.bounds.maxX - 1;
        } else if (this.body.y < this.world.bounds.minY) {
            this.body.y = this.world.bounds.maxY - 1;
        }

        // this.health -= this.moveDecay * (this.moveSpeed / 10 + 1);
    }

    changeDirection() {
        this.direction = radians(random(0, 360));
    }

    getFoodInArea() {
        const lookTile = { x: cos(this.direction) * this.sight, y: sin(this.direction) * this.sight };
        let foods = world.foods.get(this.body.x, this.body.y);
        return foods.concat(world.foods.get(this.body.x + lookTile.x, this.body.y + lookTile.y));
    }

    searchFood() {
        this.state.targetFood = -1;
        this.state.seen_food = false;

        let closest = 999999999;
        let foods = this.getFoodInArea();

        if (foods != null) {
            for (let i = foods.length - 1; i >= 0; i--) {
                if (foods[i].isEaten === true) {
                    continue;
                }

                const x = foods[i].body.x;
                const y = foods[i].body.y;

                const d = dist(x, y, this.body.x, this.body.y);
                const a = atan((y - this.body.y) / (x - this.body.x));

                const min = this.direction - this.sightWidth;
                const max = this.direction + this.sightWidth;

                if (d <= this.sight && a >= min && a <= max) {
                    if (d < closest) {
                        closest = d;
                        this.state.targetFood = i;
                        this.state.targetFoodPosition = { x: x, y: y };
                        this.state.seen_food = true;
                        break;
                    }
                }
            }
        }

        this.health -= this.searchDecay;
    }

    isFood() {
        const foods = this.getFoodInArea();
        return this.state.targetFood != -1 && foods[this.state.targetFood] != null && foods[this.state.targetFood].isEaten == false;
    }

    lookAtFood() {
        this.direction = atan((this.state.targetFoodPosition.y - this.body.y) / (this.state.targetFoodPosition.x - this.body.x));
    }

    eatTargetFood() {
        const foods = this.getFoodInArea();
        if (foods.length > this.state.targetFood && this.state.targetFood >= 0) {
            this.health += this.getFoodInArea()[this.state.targetFood].eat();
        }
        this.state.targetFood = -1;
    }

    die() {
        this.isDead = true;
    }

    spawnChild() {
        const childHealth = this.health * this.birthSplitPercent;
        this.health -= childHealth;
        this.world.agents.push(new Agent(this.body.x, this.body.y, childHealth, this, this.world));
    }

    update() {
        // Update the physics body every update based on velocity.
        this.body.update();

        // If food has been seen, target move towards it.
        if (this.state.seen_food == true) {
            if (this.tickCount % round(this.moveRate) == 0) {
                this.lookAtFood();
                this.moveToFood();
            }
            if (this.tickCount % round(this.foodSearchRate) == 0) {
                this.searchFood();
            }

            if (this.isFood() && this.body.isColliding(this.getFoodInArea()[this.state.targetFood].body), 10) {
                this.eatTargetFood();
            }
        }
        // If there is no food in the area, roam to find some.
        else if (this.state.roam == true) {
            if (this.tickCount % round(this.moveRate) == 0) {
                this.move();
            }

            if (this.tickCount % round(this.directionChangeRate) == 0) {
                this.changeDirection();
            }

            if (this.tickCount % round(this.foodSearchRate) == 0) {
                this.searchFood();
            }
        }

        if (this.tickCount % round(this.birthRate) == 0 && this.health > this.birthHealthMin) {
            this.spawnChild();
        }

        this.health -= this.lifeDecay;

        if (this.health <= 0) {
            this.die();
        }

        this.tickCount++;
    }

    draw() {
        ellipseMode(CENTER);
        fill(255, 0, 0);
        noStroke();
        ellipse(this.body.x, this.body.y, 20, 20);

        stroke(240, 10, 10);
        strokeWeight(4);
        const len = 15;
        line(this.body.x, this.body.y, this.body.x + this.body.velocity.x * len, this.body.y + this.body.velocity.y * len);

        if (this.isFood()) {
            strokeWeight(1);
            stroke(255, 255, 0);
            line(this.body.x, this.body.y, this.state.targetFoodPosition.x, this.state.targetFoodPosition.y);
        }

        const angle1 = this.direction - this.sightWidth;
        const angle2 = this.direction + this.sightWidth;
        const pt1 = { x: cos(angle1) * this.sight, y: sin(angle1) * this.sight };
        const pt2 = { x: cos(angle2) * this.sight, y: sin(angle2) * this.sight };

        strokeWeight(1);
        stroke(20, 240, 20);
        line(this.body.x, this.body.y, this.body.x + pt1.x, this.body.y + pt1.y);
        line(this.body.x, this.body.y, this.body.x + pt2.x, this.body.y + pt2.y);
    }

}