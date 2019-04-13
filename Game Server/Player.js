class Player {
    constructor(id, name){
        this.ID = id;
        this.X = 0;
        this.Y = 0;
        this.rot = 0;
        this.Name = name || "DefaultName";
        this.HeadX = 0;
        this.HeadY = 0;
        this.HeadZ = 0;
        this.HeadW = 0;
    }
}

module.exports = Player;