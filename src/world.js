class World {
    constructor(maxX, maxY, simulationSpeed) {
        this.tickCount = 0;
        this.simulationSpeed = simulationSpeed;

        // this.foods = [];
        this.foods = new Sectors(maxX, maxY, 100, 100)

        this.agents = [];

        this.bounds = { minX: 0, maxX: maxX, minY: 0, maxY: maxY };

        this.startingFood = 8000;
        this.startingAgents = 300;

        this.foodSpawnRate = 2;
        this.maxFoodPerSector = 50;

        this.mutationPercent = 0.15;
    }

    initialize() {
        for (let i = this.startingAgents - 1; i >= 0; i--) {
            this.agents.push(new Agent(random(this.bounds.minX, this.bounds.maxX), random(this.bounds.minY, this.bounds.maxY), 8000, null, this));
        }
        for (let i = this.startingFood - 1; i >= 0; i--) {
            this.foods.add(new Food(random(this.bounds.minX, this.bounds.maxX), random(this.bounds.minY, this.bounds.maxY)));
        }
    }

    update() {
        for (let i = this.simulationSpeed; i >= 0; i--) {
            for (let i = this.agents.length - 1; i >= 0; i--) {
                this.agents[i].update();
                if (this.agents[i].isDead === true) {
                    this.agents.splice(i, 1);
                }
            }

            if (this.tickCount % this.foodSpawnRate == 0) {
                this.foods.forEach(function(x, y, index) {
                    if (world.foods.tiles[x][y][index].isEaten === true) {
                        world.foods.tiles[x][y].splice(index, 1);
                    }
                });

                const randomX = random(this.bounds.minX, this.bounds.maxX);
                const randomY = random(this.bounds.minY, this.bounds.maxY);
                const tile = this.foods.worldToTile(randomX, randomY);
                if (this.foods.tiles[tile.x][tile.y].length < this.maxFoodPerSector) {
                    this.foods.add(new Food(randomX, randomY));
                }
            }

            this.tickCount++;
        }
    }

    draw() {
        this.foods.forEach(function(x, y, index) {
            world.foods.tiles[x][y][index].draw();
        });

        for (let i = this.agents.length - 1; i >= 0; i--) {
            this.agents[i].draw();
        }

        stroke(200);
        strokeWeight(100);
        line(this.bounds.minX - 50, this.bounds.minY - 50, this.bounds.maxX + 50, this.bounds.minY - 50);
        line(this.bounds.maxX + 50, this.bounds.minY - 50, this.bounds.maxX + 50, this.bounds.maxY + 50);
        line(this.bounds.maxX + 50, this.bounds.maxY + 50, this.bounds.minX - 50, this.bounds.maxY + 50);
        line(this.bounds.minX - 50, this.bounds.maxY + 50, this.bounds.minX - 50, this.bounds.minY - 50);
    }
}