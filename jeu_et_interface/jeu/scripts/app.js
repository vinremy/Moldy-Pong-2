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


        this.socket.on("connection1", this.ajoutRaquette1.bind(this));
        this.socket.on("connection2", this.ajoutRaquette2.bind(this));

        this.socket.on("disconnected", this.disconnected.bind(this));


        this.canvas = document.getElementById("canvas");
        this.canvas2 = document.getElementById("canvas2");

        this.cadence = 60;


        this.initialiser();


        this.joueur1Connecte = false;
        this.joueur2Connecte = false;
        this.musiqueBefore = null;
        this.musiqueLoop = null;
        this.timeoutIntro = null;

        this.jeuDemarrer = false

    }


    initialiser() {
        this.stage = new createjs.StageGL(this.canvas, {transparent: true});
        this.stageJeu = new createjs.StageGL(this.canvas2);

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

        this.timeoutIntro = setTimeout(() => {
            this.intro.style.display = "none";
            this.ajoutDecor();
            this.jouerMusiqueMenu();
        }, 81000);

    }


    interrompre(e) {
        alert(e.data.src);
    }

    demarrer() {
        console.log("jeu demarrer");

        this.intro = document.querySelector("iframe");

        console.log(this.canvas.width, this.canvas.height)

        this.boutonSkip = new createjs.Bitmap(this.chargeur.getResult('boutSkip'), false);
        this.boutonSkip.x = 1100;
        this.boutonSkip.y = 800;
        this.stage.addChild(this.boutonSkip);

        this.boutonSkip.scaleX = 0.5;
        this.boutonSkip.scaleY = 0.5;


        this.boutonSkip.addEventListener('click', () => {


            clearTimeout(this.timeoutIntro);
            this.timeoutIntro = null;
            // this.intro.style.display = "none";
            this.intro.remove();
            this.ajoutDecor();
            this.jouerMusiqueMenu();
            this.stage.removeChild(this.boutonSkip)
        });


        // this.jouerMusiqueJeu();


        // this.serveur = new Serveur(this.raquette1, this.raquette2);
        // this.serveur.demarrer();
    }


    ajoutDecor() {


        this.decor = new createjs.Bitmap(this.chargeur.getResult('decor'), true);
        this.fondJeu = new createjs.Bitmap(this.chargeur.getResult('fondJeu'), true);
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

        this.instruction = new createjs.Bitmap(this.chargeur.getResult('instruction'), true);


        this.stage.addChild(this.decor, this.vie_1_joueur1, this.vie_2_joueur1, this.vie_3_joueur1, this.vie_4_joueur1, this.vie_5_joueur1, this.vie_1_joueur2, this.vie_2_joueur2, this.vie_3_joueur2, this.vie_4_joueur2, this.vie_5_joueur2);

        //this.vieJoueur1, this.vieJoueur2, ,

        this.stageJeu.addChild(this.fondJeu, this.instruction);

        this.instruction.scaleX = 0.7;
        this.instruction.scaleY = 0.7;

        this.instruction.x = 120;
        this.instruction.y = 10;

        this.phoneQr.scaleX = 0.5;
        this.phoneQr.scaleY = 0.5;


        this.phoneQr.x = 425;

        this.phoneQr.y = 30;


        this.vieJoueur1.x = 306;
        this.vieJoueur2.x = 1212;

        this.vieJoueur1.scaleX = 0.4;
        this.vieJoueur1.scaleY = 0.2;

        this.vieJoueur2.scaleX = 0.5;
        this.vieJoueur2.scaleY = 0.5;

        this.vie_1_joueur1.scaleX = 0.3;
        this.vie_1_joueur1.scaleY = 0.3;

        this.vie_2_joueur1.scaleX = 0.3;
        this.vie_2_joueur1.scaleY = 0.3;

        this.vie_3_joueur1.scaleX = 0.3;
        this.vie_3_joueur1.scaleY = 0.3;

        this.vie_4_joueur1.scaleX = 0.3;
        this.vie_4_joueur1.scaleY = 0.3;

        this.vie_5_joueur1.scaleX = 0.3;
        this.vie_5_joueur1.scaleY = 0.3;

        this.vie_1_joueur1.y = 105;
        this.vie_2_joueur1.y = 105;
        this.vie_3_joueur1.y = 105;
        this.vie_4_joueur1.y = 105;
        this.vie_5_joueur1.y = 105;


        this.vie_1_joueur1.x = 400;
        this.vie_2_joueur1.x = 440;
        this.vie_3_joueur1.x = 480;
        this.vie_4_joueur1.x = 520;
        this.vie_5_joueur1.x = 560;


        this.vie_1_joueur1.vivant = true;
        this.vie_2_joueur1.vivant = true;
        this.vie_3_joueur1.vivant = true;
        this.vie_4_joueur1.vivant = true;
        this.vie_5_joueur1.vivant = true;


        //joueur 2

        this.vie_1_joueur2.scaleX = 0.3;
        this.vie_1_joueur2.scaleY = 0.3;

        this.vie_2_joueur2.scaleX = 0.3;
        this.vie_2_joueur2.scaleY = 0.3;

        this.vie_3_joueur2.scaleX = 0.3;
        this.vie_3_joueur2.scaleY = 0.3;

        this.vie_4_joueur2.scaleX = 0.3;
        this.vie_4_joueur2.scaleY = 0.3;

        this.vie_5_joueur2.scaleX = 0.3;
        this.vie_5_joueur2.scaleY = 0.3;

        this.vie_1_joueur2.y = 105;
        this.vie_2_joueur2.y = 105;
        this.vie_3_joueur2.y = 105;
        this.vie_4_joueur2.y = 105;
        this.vie_5_joueur2.y = 105;


        this.vie_1_joueur2.x = 720;
        this.vie_2_joueur2.x = 760;
        this.vie_3_joueur2.x = 800;
        this.vie_4_joueur2.x = 840;
        this.vie_5_joueur2.x = 880;


        this.vie_1_joueur2.vivant = true;
        this.vie_2_joueur2.vivant = true;
        this.vie_3_joueur2.vivant = true;
        this.vie_4_joueur2.vivant = true;
        this.vie_5_joueur2.vivant = true;


    }

    //---------------------------Musiques---------------------------//
    jouerMusiqueMenu() {

        this.musiqueBefore = createjs.Sound.play("musiqueMenu_before");
        this.musiqueBefore.play();
        this.musiqueBefore.volume = 0.4;

        setTimeout(() => {
            this.musiqueLoop = createjs.Sound.play("musiqueMenu_loop", {loop: -1});
            this.musiqueLoop.volume = 0.4;
        }, 9121);

        this.musiqueBefore.volume = 0.4;

    }

    jouerMusiqueFin() {

        let i = Math.ceil(Math.random() * 2)

        this.musiqueLoop = createjs.Sound.play("musiqueFin" + i + "_loop", {loop: -1});
        this.musiqueLoop.play();
        this.musiqueLoop.volume = 0.4;

    }

    jouerMusiqueJeu() {

        let i = Math.ceil(Math.random() * 2)

        this.musiqueBefore = createjs.Sound.play("musiqueBattle" + i + "_before");
        this.musiqueBefore.play();
        this.musiqueBefore.volume = 0.30;

        if (i === 1) {
            setTimeout(() => {
                this.musiqueLoop = createjs.Sound.play("musiqueBattle" + i + "_loop", {loop: -1});
                this.musiqueLoop.volume = 0.4;
            }, 33294);
        } else if (i === 2) {
            setTimeout(() => {
                this.musiqueLoop = createjs.Sound.play("musiqueBattle" + i + "_loop", {loop: -1});
                this.musiqueLoop.volume = 0.4;
            }, 42578);
        }


    }

    arretMusique() {
        this.musiqueLoop.stop();
        this.musiqueBefore.stop();
    }


    //---------------------------SFX---------------------------//

    jouerFrappe() {

        let h = Math.ceil(Math.random() * 5);
        setTimeout(() => {
            createjs.Sound.play("foodHit" + h);
        }, 100)


        let w = Math.ceil(Math.random() * 5)
        createjs.Sound.play("woosh" + w);

        //console.log(w, h)
    }

    jouerManque() {
        let s = Math.ceil(Math.random() * 5)
        createjs.Sound.play("foodSquish" + s);

        let t = Math.ceil(Math.random() * 3)
        createjs.Sound.play("tableHit" + t);

    }


    //------------------------------------------------------//
    ajoutRaquette1(e) {

        // this.socket.on("raquette", message => {
        //

        // });

        console.log(e.raquette);
        if (e.raquette === "poele"){
            this.raquette1.scaleX = -0.7;
        }
        else{
            this.raquette1.scaleX = 0.7;
        }

        this.raquette1 = new Raquette(this.chargeur, e.raquette);

        // this.raquette1 = new Raquette(this.chargeur, "spatule" );



        this.raquette1.scaleY = 0.7;

        this.stageJeu.addChild(this.raquette1);


        this.joueur1Connecte = true;

        this.surConnection();

        this.arretMusique();

    }


    ajoutRaquette2(e) {
        this.raquette2 = new Raquette(this.chargeur, e.raquette);


        this.raquette2.scaleX = 0.7;
        this.raquette2.scaleY = 0.7;

        // this.raquette1 = new Raquette(this.chargeur);
        this.stageJeu.addChild(this.raquette2);
        this.raquette2.x = this.canvas2.width - 60;

        // setInterval(this.creationBallePerime.bind(this), 5000);
        // setInterval(this.creationBalleSaine.bind(this), 15000);
        //
        //
        // this.jeuDemarrer = true;
        // this.jouerMusiqueJeu();
        //
        // this.stageJeu.removeChild(this.instruction);

        this.joueur2Connecte = true;

        this.surConnection()
    }

    surConnection() {

        console.log("une connection");

        if (this.jeuDemarrer === false) {


            if (this.joueur1Connecte === true && this.joueur2Connecte === true) {

                this.jeuDemarrer = true;
                this.jouerMusiqueJeu();

                this.stageJeu.removeChild(this.instruction);


                this.intervalPerime = setInterval(this.creationBallePerime.bind(this), 5000);
                this.intervalSaint = setInterval(this.creationBalleSaine.bind(this), 15000);
            }


            //
            // this.jeuDemarrer = true;
            // this.jouerMusiqueJeu();
            // this.stage.removeChild(this.phoneQr);
            //
            //
            // setInterval(this.lancementJeu.bind(this), 5000);

        }
    }

    creationBallePerime() {


        this.skinBalle = Math.floor(Math.random() * Math.floor(6 - 1) + 1);

        // let colorOptions = ["tomateMoldy", "chouxMoldy", "oignonMoldy", "patateMoldy", "radisMoldy"];
        // this.idSkinBalle = colorOptions(this.skinBalle)

        if (this.skinBalle === 1) {
            this.idSkinBalle = "tomateMoldy"
        }


        else if (this.skinBalle === 2) {
            this.idSkinBalle = "chouxMoldy"
        }


        else if (this.skinBalle === 3) {
            this.idSkinBalle = "oignonMoldy"
        }


        else if (this.skinBalle === 4) {
            this.idSkinBalle = "patateMoldy"
        }


        else if (this.skinBalle === 5) {
            this.idSkinBalle = "radisMoldy"
        }

        else if (this.skinBalle === 6) {
            this.idSkinBalle = "tomate"
        }

        else if (this.skinBalle === 7) {
            this.idSkinBalle = "choux"
        }

        else if (this.skinBalle === 8) {
            this.idSkinBalle = "patate"
        }

        else if (this.skinBalle === 9) {
            this.idSkinBalle = "radis"
        }

        else if (this.skinBalle === 10) {
            this.idSkinBalle = "oignon"
        }


        this.balle = new Tomate(this.chargeur, this.canvas, this.raquette1, this.raquette2, this.pointsJ1, this.pointsJ2, this, this.idSkinBalle, this.canvas2);

        this.stageJeu.addChild(this.balle);
    }


    creationBalleSaine() {


        this.skinBalle = Math.floor(Math.random() * Math.floor(6 - 1) + 1)

        // let colorOptions = ["tomateMoldy", "chouxMoldy", "oignonMoldy", "patateMoldy", "radisMoldy"];
        // this.idSkinBalle = colorOptions(this.skinBalle)


        if (this.skinBalle === 1) {
            this.idSkinBalle = "tomate"
        }

        else if (this.skinBalle === 2) {
            this.idSkinBalle = "choux"
        }

        else if (this.skinBalle === 3) {
            this.idSkinBalle = "patate"
        }

        else if (this.skinBalle === 4) {
            this.idSkinBalle = "radis"
        }

        else if (this.skinBalle === 5) {
            this.idSkinBalle = "oignon"
        }


        this.balle = new Tomate(this.chargeur, this.canvas, this.raquette1, this.raquette2, this.pointsJ1, this.pointsJ2, this, this.idSkinBalle, this.canvas2);

        this.stageJeu.addChild(this.balle);
    }


    actualiser(e) {
        this.stage.update(e);
        this.stageJeu.update(e);

    }


    mouvementJoueur1(e) {


        this.joueur1Connecte = true;


        if (e.beta <= -45) {

            this.raquette1.y = 460


        }

        if (e.beta >= 45) {
            this.raquette1.y = 0
        }


        if (e.beta >= -45 && e.beta <= 45) {


            this.raquette1.y = (-(e.beta) + 45) / 100 * this.canvas2.height;


        }


    }

    mouvementJoueur2(e) {


        this.joueur2Connecte = true;

        if (e.beta <= -45) {


            this.raquette2.y = 460


        }

        if (e.beta >= 45) {
            this.raquette2.y = 0
        }


        if (e.beta >= -45 && e.beta <= 45) {


            this.raquette2.y = (-(e.beta) + 45) / 100 * this.canvas2.height;


        }


    }


    augmenterPointJ2() {


        if (this.vie_5_joueur1.vivant === true) {
            this.vie_5_joueur1.vivant = false;
            this.jouerManque();
            this.stage.removeChild(this.vie_5_joueur1)

        } else if (this.vie_4_joueur1.vivant === true) {
            this.vie_4_joueur1.vivant = false;
            this.jouerManque();
            this.stage.removeChild(this.vie_4_joueur1)
        } else if (this.vie_3_joueur1.vivant === true) {
            this.vie_3_joueur1.vivant = false;
            this.jouerManque();
            this.stage.removeChild(this.vie_3_joueur1)
        } else if (this.vie_2_joueur1.vivant === true) {
            this.vie_2_joueur1.vivant = false;
            this.jouerManque();
            this.stage.removeChild(this.vie_2_joueur1)
        } else if (this.vie_1_joueur1.vivant === true) {
            this.vie_1_joueur1.vivant = false;
            this.jouerManque();
            this.stage.removeChild(this.vie_1_joueur1);

            // appeler fin
            this.endGame();

            this.arretMusique();
            this.jouerMusiqueFin();
        }


    }

    augmenterPointJ1() {


        if (this.vie_5_joueur2.vivant === true) {
            this.vie_5_joueur2.vivant = false;
            this.jouerManque();
            this.stage.removeChild(this.vie_5_joueur2)

        } else if (this.vie_4_joueur2.vivant === true) {
            this.vie_4_joueur2.vivant = false;
            this.jouerManque();
            this.stage.removeChild(this.vie_4_joueur2)
        } else if (this.vie_3_joueur2.vivant === true) {
            this.vie_3_joueur2.vivant = false;
            this.jouerManque();
            this.stage.removeChild(this.vie_3_joueur2)
        } else if (this.vie_2_joueur2.vivant === true) {
            this.vie_2_joueur2.vivant = false;
            this.jouerManque();
            this.stage.removeChild(this.vie_2_joueur2)
        } else if (this.vie_1_joueur2.vivant === true) {
            this.vie_1_joueur2.vivant = false;
            this.jouerManque();
            this.stage.removeChild(this.vie_1_joueur2);

            // appeler fin
            this.arretMusique();
            this.jouerMusiqueFin();

            this.endGame();

            this.gagnant = new createjs.Bitmap(this.chargeur.getResult('succes'))
            this.gagnant.x = 500;
            this.gagnant.y = 200;
            this.stageJeu.addChild(this.gagnant);
        }


    }

    augmenteVieJ1() {
        if (this.vie_5_joueur1.vivant === false && this.vie_4_joueur1.vivant === true) {
            this.stage.addChild(this.vie_5_joueur1);
            this.vie_5_joueur1.vivant = true
        }

        else if (this.vie_4_joueur1.vivant === false && this.vie_3_joueur1.vivant === true) {
            this.stage.addChild(this.vie_4_joueur1);
            this.vie_4_joueur1.vivant = true
        }

        else if (this.vie_3_joueur1.vivant === false && this.vie_2_joueur1.vivant === true) {
            this.stage.addChild(this.vie_3_joueur1);
            this.vie_3_joueur1.vivant = true
        }


        else if (this.vie_2_joueur1.vivant === false && this.vie_1_joueur1.vivant === true) {
            this.stage.addChild(this.vie_2_joueur1);
            this.vie_2_joueur1.vivant = true
        }


    }

    augmenteVieJ2() {
        if (this.vie_5_joueur2.vivant === false && this.vie_4_joueur2.vivant === true) {
            this.stage.addChild(this.vie_5_joueur2);
            this.vie_5_joueur2.vivant = true
        }

        else if (this.vie_4_joueur2.vivant === false && this.vie_3_joueur2.vivant === true) {
            this.stage.addChild(this.vie_4_joueur2);
            this.vie_4_joueur2.vivant = true
        }

        else if (this.vie_3_joueur2.vivant === false && this.vie_2_joueur2.vivant === true) {
            this.stage.addChild(this.vie_3_joueur2);
            this.vie_3_joueur2.vivant = true
        }


        else if (this.vie_2_joueur2.vivant === false && this.vie_1_joueur2.vivant === true) {
            this.stage.addChild(this.vie_2_joueur2);
            this.vie_2_joueur2.vivant = true
        }
    }


    endGame() {

        clearInterval(this.intervalPerime);
        clearInterval(this.intervalSaint);
        this.stageJeu.removeChild(this.balle);

        this.socket.emit("finJeu", {type: "finJeu",});

        // INTERFACE DE FIN DE JEU
        this.interfaceDeFin = new createjs.Bitmap(this.chargeur.getResult('interfaceFin'));
        this.stageJeu.addChild(this.interfaceDeFin);
        console.log(this.interfaceDeFin);



        setTimeout(() => {
            location.reload(true);

        }, 25000);

    }

    // redemarrer() {
    //     if (this.vie_5_joueur2.vivant === false) {
    //         this.stage.addChild(this.vie_5_joueur2);
    //         this.vie_5_joueur2.vivant = true
    //     }
    //
    //     else if (this.vie_4_joueur2.vivant === false) {
    //         this.stage.addChild(this.vie_4_joueur2);
    //         this.vie_4_joueur2.vivant = true
    //     }
    //
    //     else if (this.vie_3_joueur2.vivant === false) {
    //         this.stage.addChild(this.vie_3_joueur2);
    //         this.vie_3_joueur2.vivant = true
    //     }
    //
    //
    //     else if (this.vie_2_joueur2.vivant === false) {
    //         this.stage.addChild(this.vie_2_joueur2);
    //         this.vie_2_joueur2.vivant = true
    //     }
    //     else if (this.vie_1_joueur2.vivant === false) {
    //         this.stage.addChild(this.vie_1_joueur2);
    //         this.vie_1_joueur2.vivant = true
    //     }
    //
    //
    //
    //     if (this.vie_5_joueur1.vivant === false) {
    //         this.stage.addChild(this.vie_5_joueur1);
    //         this.vie_5_joueur1.vivant = true
    //     }
    //
    //     else if (this.vie_4_joueur1.vivant === false) {
    //         this.stage.addChild(this.vie_4_joueur1);
    //         this.vie_4_joueur1.vivant = true
    //     }
    //
    //     else if (this.vie_3_joueur1.vivant === false) {
    //         this.stage.addChild(this.vie_3_joueur1);
    //         this.vie_3_joueur1.vivant = true
    //     }
    //
    //
    //     else if (this.vie_2_joueur1.vivant === false) {
    //         this.stage.addChild(this.vie_2_joueur1);
    //         this.vie_2_joueur1.vivant = true
    //     }
    //     else if (this.vie_1_joueur1.vivant === false) {
    //         this.stage.addChild(this.vie_1_joueur1);
    //         this.vie_1_joueur1.vivant = true
    //     }
    //
    //
    //
    // }


    disconnected(e) {

    }
}

