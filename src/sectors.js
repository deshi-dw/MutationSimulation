class Sectors {
    constructor(wwidth, wheight, tileWidth, tileHeight) {
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.columns = floor(wwidth / tileWidth);
        this.rows = floor(wheight / tileHeight);

        this.tiles = [];

        for (let x = 0; x < this.columns; x++) {
            this.tiles.push([]);
            for (let y = this.rows - 1; y >= 0; y--) {
                this.tiles[x].push([]);
            }
        }
    }

    add(object) {
        if (object.body != null) {
            const tile = this.worldToTile(object.body.x, object.body.y);
            this.tiles[tile.x][tile.y].push(object);
        }
    }

    remove(x, y, index) {
        if (object.body != null) {
            const tile = this.worldToTile(object.body.x, object.body.y);
            this.tiles[tile.x][tile.y].slice(index, 1);
        }
    }

    get(worldX, worldY) {
        const x = min(max(worldX, 0), this.tileWidth * (this.columns - 1));
        const y = min(max(worldY, 0), this.tileHeight * (this.rows - 1));
        const tile = this.worldToTile(x, y);
        const temp = this.tiles[tile.x][tile.y];
        return temp;
    }

    worldToTile(x, y) {
        return { x: floor(x / this.tileWidth), y: floor(y / this.tileHeight) };
    }

    tileToWorld(x, y) {
        return { x: x * this.tileWidth, y: y * this.tileHeight };
    }

    forEach(func) {
        for (let x = this.tiles.length - 1; x >= 0; x--) {
            for (let y = this.tiles[x].length - 1; y >= 0; y--) {
                for (let i = this.tiles[x][y].length - 1; i >= 0; i--) {
                    func(x, y, i);
                }
            }
        }
    }

}