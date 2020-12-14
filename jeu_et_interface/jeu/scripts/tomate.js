export class Tomate extends createjs.Bitmap {

    constructor(chargeur, canvas, raquette1, raquette2, point1, point2, app, idSkinBalle, canvasJeu) {


        super(chargeur.getResult(idSkinBalle));


        this.raquette1 = raquette1;
        this.raquette2 = raquette2;
        this.canvas = canvas;
        this.canvas2 = canvasJeu;

        this.app = app;

        this.idSkinBalle = idSkinBalle;

        this.rebond = true;




        if (this.idSkinBalle === "tomateMoldy" || this.idSkinBalle === "chouxMoldy" || this.idSkinBalle === "oignonMoldy") {
            this.scaleX = 0.1;
            this.scaleY = 0.1;
        }

        else {
            this.scaleX = 0.5;
            this.scaleY = 0.5;
        }


        if (this.idSkinBalle === 'tomateMoldy' || this.idSkinBalle === "chouxMoldy" || this.idSkinBalle === "oignonMoldy" || this.idSkinBalle === "patateMoldy" || this.idSkinBalle === "radisMoldy") {
            this.perime = true
        }

        else{
            this.scaleX = 0.9;
            this.scaleY = 0.9;
        }

        this.hauteur = Math.floor(Math.random()*500);

        this.x = this.canvas2.width / 2;
        this.y = this.hauteur;

        this.min = Math.ceil(5);
        this.max = Math.floor(10);

        this.min2 = Math.ceil(0);

        this.directionX = Math.floor(Math.random() * Math.floor(this.max - this.min) + this.min) * ((Math.floor(Math.random() - 0.5) * 2) + 1);
        this.directionY = Math.floor(Math.random() * Math.floor(this.max - this.min2) + this.min2) * ((Math.floor(Math.random() - 0.5) * 2) + 1);

        createjs.Ticker.addEventListener("tick", this.deplacerBalle.bind(this));

console.log(this.y)

    }


    deplacerBalle() {


        this.x += this.directionX;
        this.y += this.directionY;

        this.collision = ndgmr.checkRectCollision(this, this.raquette1);
        this.collision2 = ndgmr.checkRectCollision(this, this.raquette2);

        if (this.collision || this.collision2) {
            console.log("collision");

            if (this.rebond === true) {
                this.directionX = -this.directionX;

                this.rebond = false;

                setTimeout(() => {
                    this.rebond = true
                }, 300)
            }


        }


        if (this.y <= 0) {
            this.directionY = -this.directionY
        }


        if (this.y >= 500) {
            this.directionY = -this.directionY
        }


        if (this.x <= 0) {


            if (this.perime){
                this.app.augmenterPointJ2();
            }

            else {
                this.app.augmenteVieJ1();
            }




            this.detruire();


        }

        if (this.x >= this.canvas2.width) {

            if (this.perime){
                this.app.augmenterPointJ1();
            }

            else{
                this.app.augmenteVieJ2();
            }




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