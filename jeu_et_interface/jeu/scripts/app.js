// import {Serveur} from "./Serveur.js";
import {Raquette} from "./raquette.js";
import {Tomate} from "./tomate.js";


export class Application {

    constructor() {


        this.socket = io("https://vremy.dectim.ca:3011", {
            query: {type: 'jeu'} // identification en tant que jeu
        });

        this.socket.on("joueur1", this.mouvementJoueur1.bind(this));
        this.socket.on("joueur2", this.mouvementJoueur2.bind(this));


        this.canvas = document.querySelector("canvas");

        this.cadence = 60;


        this.initialiser();


        this.joueur1Connecte = false;
        this.joueur2Connecte = false;


        this.jeuDemarrer = false

    }


    initialiser() {
        this.stage = new createjs.StageGL(this.canvas);

        createjs.Ticker.addEventListener("tick", this.actualiser.bind(this));


        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.framerate = this.cadence;

        this.chargeur = new createjs.LoadQueue();

        this.chargeur.installPlugin(createjs.Sound);

        this.chargeur.loadManifest("ressources/manifest.json");
        this.chargeur.addEventListener('error', this.interrompre);
        this.chargeur.addEventListener('complete', this.demarrer.bind(this));


        this.pointsJ1 = 0;
        this.pointsJ2 = 0;


    }


    interrompre(e) {
        alert(e.data.src);
    }

    demarrer() {
        console.log("jeu demarrer");
        this.raquette1 = new Raquette(this.chargeur, "poele");
        this.raquette2 = new Raquette(this.chargeur, "poele");

        this.ajoutDecor();


        // this.serveur = new Serveur(this.raquette1, this.raquette2);
        // this.serveur.demarrer();
    }


    ajoutDecor() {


        this.decor = new createjs.Bitmap(this.chargeur.getResult('decor'), true);
        this.vieJoueur1 = new createjs.Bitmap(this.chargeur.getResult('joueur1'), true);
        this.vieJoueur2 = new createjs.Bitmap(this.chargeur.getResult('joueur2'), true);

        this.vie_1_joueur1 = new createjs.Bitmap(this.chargeur.getResult('etoile'), true);
        this.vie_2_joueur1 = new createjs.Bitmap(this.chargeur.getResult('etoile'), true);
        this.vie_3_joueur1 = new createjs.Bitmap(this.chargeur.getResult('etoile'), true);
        this.vie_4_joueur1 = new createjs.Bitmap(this.chargeur.getResult('etoile'), true);
        this.vie_5_joueur1 = new createjs.Bitmap(this.chargeur.getResult('etoile'), true);


        this.vie_1_joueur2 = new createjs.Bitmap(this.chargeur.getResult('etoile'), true);
        this.vie_2_joueur2 = new createjs.Bitmap(this.chargeur.getResult('etoile'), true);
        this.vie_3_joueur2 = new createjs.Bitmap(this.chargeur.getResult('etoile'), true);
        this.vie_4_joueur2 = new createjs.Bitmap(this.chargeur.getResult('etoile'), true);
        this.vie_5_joueur2 = new createjs.Bitmap(this.chargeur.getResult('etoile'), true);



        this.phoneQr = new createjs.Bitmap(this.chargeur.getResult('phoneQr'), true);


        this.stage.addChild(this.decor, this.vieJoueur1, this.vieJoueur2, this.vie_1_joueur1, this.vie_2_joueur1, this.vie_3_joueur1, this.vie_4_joueur1, this.vie_5_joueur1, this.vie_1_joueur2, this.vie_2_joueur2, this.vie_3_joueur2, this.vie_4_joueur2, this.vie_5_joueur2, this.phoneQr);


        this.phoneQr.x = 690;

        this.phoneQr.y = 0;


        this.vieJoueur1.x = 306;
        this.vieJoueur2.x = 1212;

        this.vieJoueur1.scaleX = 0.5;
        this.vieJoueur1.scaleY = 0.5;

        this.vieJoueur2.scaleX = 0.5;
        this.vieJoueur2.scaleY = 0.5;

        this.vie_1_joueur1.scaleX = 0.5;
        this.vie_1_joueur1.scaleY = 0.5;

        this.vie_2_joueur1.scaleX = 0.5;
        this.vie_2_joueur1.scaleY = 0.5;

        this.vie_3_joueur1.scaleX = 0.5;
        this.vie_3_joueur1.scaleY = 0.5;

        this.vie_4_joueur1.scaleX = 0.5;
        this.vie_4_joueur1.scaleY = 0.5;

        this.vie_5_joueur1.scaleX = 0.5;
        this.vie_5_joueur1.scaleY = 0.5;

        this.vie_1_joueur1.y = 170;
        this.vie_2_joueur1.y = 170;
        this.vie_3_joueur1.y = 170;
        this.vie_4_joueur1.y = 170;
        this.vie_5_joueur1.y = 170;


        this.vie_1_joueur1.x = 330;
        this.vie_2_joueur1.x = 400;
        this.vie_3_joueur1.x = 470;
        this.vie_4_joueur1.x = 540;
        this.vie_5_joueur1.x = 610;


        this.vie_1_joueur1.vivant = true;
        this.vie_2_joueur1.vivant = true;
        this.vie_3_joueur1.vivant = true;
        this.vie_4_joueur1.vivant = true;
        this.vie_5_joueur1.vivant = true;


        //joueur 2

        this.vie_1_joueur2.scaleX = 0.5;
        this.vie_1_joueur2.scaleY = 0.5;

        this.vie_2_joueur2.scaleX = 0.5;
        this.vie_2_joueur2.scaleY = 0.5;

        this.vie_3_joueur2.scaleX = 0.5;
        this.vie_3_joueur2.scaleY = 0.5;

        this.vie_4_joueur2.scaleX = 0.5;
        this.vie_4_joueur2.scaleY = 0.5;

        this.vie_5_joueur2.scaleX = 0.5;
        this.vie_5_joueur2.scaleY = 0.5;

        this.vie_1_joueur2.y = 170;
        this.vie_2_joueur2.y = 170;
        this.vie_3_joueur2.y = 170;
        this.vie_4_joueur2.y = 170;
        this.vie_5_joueur2.y = 170;


        this.vie_1_joueur2.x = 1230;
        this.vie_2_joueur2.x = 1300;
        this.vie_3_joueur2.x = 1370;
        this.vie_4_joueur2.x = 1440;
        this.vie_5_joueur2.x = 1510;


        this.vie_1_joueur2.vivant = true;
        this.vie_2_joueur2.vivant = true;
        this.vie_3_joueur2.vivant = true;
        this.vie_4_joueur2.vivant = true;
        this.vie_5_joueur2.vivant = true;


    }


    ajoutRaquette1() {


        this.stage.addChild(this.raquette1);

        this.surConnection();


    }


    ajoutRaquette2() {


        // this.raquette1 = new Raquette(this.chargeur);
        this.stage.addChild(this.raquette2);
        this.raquette2.x = this.canvas.width - 120;

        this.surConnection()
    }

    surConnection() {

        if (this.jeuDemarrer === false) {


            if (this.joueur1Connecte === true && this.joueur2Connecte === true) {

                this.jeuDemarrer = true;

                this.stage.removeChild(this.phoneQr);

                setInterval(this.lancementJeu.bind(this), 2500);
            }
        }
    }

    lancementJeu() {


      


        this.skinBalle = Math.floor(Math.random() * Math.floor(6 - 1) + 1);

        if (this.skinBalle === 1) {
            this.idSkinBalle = "tomateMoldy"
        }


        if (this.skinBalle === 2) {
            this.idSkinBalle = "chouxMoldy"
        }


        if (this.skinBalle === 3) {
            this.idSkinBalle = "oignonMoldy"
        }


        if (this.skinBalle === 4) {
            this.idSkinBalle = "patateMoldy"
        }


        if (this.skinBalle === 5) {
            this.idSkinBalle = "radisMoldy"
        }


        this.balle = new Tomate(this.chargeur, this.canvas, this.raquette1, this.raquette2, this.pointsJ1, this.pointsJ2, this, this.idSkinBalle);

        this.stage.addChild(this.balle);


    }


    actualiser(e) {
        this.stage.update(e);

    }


    mouvementJoueur1(e) {

        this.joueur1Connecte = true;
        this.ajoutRaquette1();


        if (e.beta <= -45) {

            this.raquette1.y = 760


        }

        if (e.beta >= 45) {
            this.raquette1.y = 0
        }


        if (e.beta >= -45 && e.beta <= 45) {


            this.raquette1.y = (-(e.beta) + 45) / 100 * this.canvas.height;


        }


    }

    mouvementJoueur2(e) {

        this.ajoutRaquette2();

        this.joueur2Connecte = true;

        if (e.beta <= -45) {


            this.raquette2.y = 760


        }

        if (e.beta >= 45) {
            this.raquette2.y = 0
        }


        if (e.beta >= -45 && e.beta <= 45) {


            this.raquette2.y = (-(e.beta) + 45) / 100 * this.canvas.height;


        }


    }


    augmenterPointJ2() {


        if (this.vie_5_joueur1.vivant === true) {
            this.vie_5_joueur1.vivant = false;
            this.stage.removeChild(this.vie_5_joueur1)

        }

        else if (this.vie_4_joueur1.vivant === true) {
            this.vie_4_joueur1.vivant = false;
            this.stage.removeChild(this.vie_4_joueur1)
        }

        else if (this.vie_3_joueur1.vivant === true) {
            this.vie_3_joueur1.vivant = false;
            this.stage.removeChild(this.vie_3_joueur1)
        }


        else if (this.vie_2_joueur1.vivant === true) {
            this.vie_2_joueur1.vivant = false;
            this.stage.removeChild(this.vie_2_joueur1)
        }

        else if (this.vie_1_joueur1.vivant === true) {
            this.vie_1_joueur1.vivant = false;
            this.stage.removeChild(this.vie_1_joueur1)

            // appeler fin
        }


    }

    augmenterPointJ1() {


        if (this.vie_5_joueur2.vivant === true) {
            this.vie_5_joueur2.vivant = false;
            this.stage.removeChild(this.vie_5_joueur2)

        }

        else if (this.vie_4_joueur2.vivant === true) {
            this.vie_4_joueur2.vivant = false;
            this.stage.removeChild(this.vie_4_joueur2)
        }

        else if (this.vie_3_joueur2.vivant === true) {
            this.vie_3_joueur2.vivant = false;
            this.stage.removeChild(this.vie_3_joueur2)
        }


        else if (this.vie_2_joueur2.vivant === true) {
            this.vie_2_joueur2.vivant = false;
            this.stage.removeChild(this.vie_2_joueur2)
        }

        else if (this.vie_1_joueur2.vivant === true) {
            this.vie_1_joueur2.vivant = false;
            this.stage.removeChild(this.vie_1_joueur2)

            // appeler fin
        }


    }


}

