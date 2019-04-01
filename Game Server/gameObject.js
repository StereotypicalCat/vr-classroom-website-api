class gameObject {
    constructor(id,name,x,y,z){
        this.ID = id;
        this.X = x;
        this.Y = y;
        this.Z = z;
        this.rot = 0;
        this.Name = name;
        this.f1 = 0.0;
        this.f2 = 0.0;
        this.i1 = 0;
        this.i2 = 0;
        this.s1 = "";
        this.s2 = "";
    }
}
module.exports = {gameObject};