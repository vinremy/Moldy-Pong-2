export class Tomate extends createjs.Bitmap {

    constructor(chargeur, canvas, raquette1, raquette2, point1, point2, app, idSkinBalle) {


        super(chargeur.getResult(idSkinBalle));


        this.raquette1 = raquette1;
        this.raquette2 = raquette2;
        this.canvas = canvas;

        this.app = app;

        this.idSkinBalle = idSkinBalle;

        this.rebond = true


        if (this.idSkinBalle === "tomateMoldy" || this.idSkinBalle === "chouxMoldy" || this.idSkinBalle === "oignonMoldy") {
            this.scaleX = 0.2;
            this.scaleY = 0.2;
        }

        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;

        this.min = Math.ceil(10);
        this.max = Math.floor(15);

        this.min2 = Math.ceil(0);

        this.directionX = Math.floor(Math.random() * Math.floor(this.max - this.min) + this.min) * ((Math.floor(Math.random() - 0.5) * 2) + 1);
        this.directionY = Math.floor(Math.random() * Math.floor(this.max - this.min2) + this.min2) * ((Math.floor(Math.random() - 0.5) * 2) + 1);

        createjs.Ticker.addEventListener("tick", this.deplacerBalle.bind(this));





    }


    deplacerBalle() {


        this.x += this.directionX;
        this.y += this.directionY;

        this.collision = ndgmr.checkRectCollision(this, this.raquette1);
        this.collision2 = ndgmr.checkRectCollision(this, this.raquette2);

        if (this.collision || this.collision2) {
            console.log("collision");

            if (this.rebond === true){
                this.directionX = -this.directionX;
                this.directionY = -this.directionY;
                this.rebond = false;

                setTimeout( () => {this.rebond = true},300 )
            }









        }


        if (this.y <= 0) {
            this.directionY = -this.directionY
        }


        if (this.y >= 912) {
            this.directionY = -this.directionY
        }


        if (this.x <= 0) {


            this.app.augmenterPointJ2();


            this.detruire();


        }

        if (this.x >= this.canvas.width) {

            this.app.augmenterPointJ1();


            this.detruire();


        }

    }

    detruire() {

        this.directionY = 0;
        this.directionX = 0;

        this.x = this.canvas.width / 2;
        this.y = -500;
    }


}