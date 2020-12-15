export class Interface {


    constructor() {

        this.socket = io("https://vremy.dectim.ca:3011", {
            query: {type: "Mika"}
        });


        this.removeEvent = false;

        this.inactif = true;




        // Bouton pour demander la permission d'accéder aux données de positionnement
        document.querySelector(".btnAutorise").addEventListener("click", this.autoriser.bind(this));
        document.querySelector(".btnAutorise2").addEventListener("click", this.autoriser2.bind(this));
        document.querySelector(".btnAutorise3").addEventListener("click", this.autoriser3.bind(this));

        this.fenetreListe = document.querySelector(".file-attente");
        this.fenetreRaquette = document.querySelector(".containerToutSlide");
        this.logo = document.querySelector(".logo");

            console.log("test");

        this.socket.on("redirect", this.redirect.bind(this));

        this.socket.on("position", message => {

            console.log(message.position);



            if (message.position === 1 || message.position === 0){
                this.fenetreListe.style.display = "none";
                this.fenetreRaquette.style.display = "block";
                this.logo.style.display = "block";

                if (this.inactif === true){
                    this.timeoutInnactive = setTimeout(() => {
                        this.innactive();
                    }, 79800);
                }


            }

            else{
                document.getElementById("position").innerText = message.position;

                this.fenetreListe.style.display = "block";
                this.fenetreRaquette.style.display = "none";
                this.logo.style.display = "none";
            }
        });

    }


    autoriser(e) {

        // Vérifier si les événements d'orientation sont disponibles sur cette plateforme

        clearTimeout(this.timeoutInnactive);
        this.timeoutInnactive = null;
        this.inactif = false;

        if (this.removeEvent === false) {

            this.removeEvent = true;

            if (!window.DeviceOrientationEvent || !window.DeviceOrientationEvent.requestPermission) {
                // alert("Oups! Votre fureteur ne supporte pas la détection d'orientation.");
                // return;
                window.addEventListener('deviceorientation', this.gererOrientation.bind(this));
                this.socket.emit("connection", {type: "connection", raquette: "poele"});

                // this.socket.emit("poele", {type : "poele"});


            }

            DeviceOrientationEvent.requestPermission()
                .then(state => {
                    if (state === 'granted') {
                        window.addEventListener('deviceorientation', this.gererOrientation.bind(this));
                        this.socket.emit("connection", {type: "connection", raquette: "poele"});

                        // this.socket.emit("poele", {type : "poele"});

                    }
                });
        }


        // Demande de permission à l'usager pour l'utilisation des événements d'orientation


    }


    autoriser2(e) {

        clearTimeout(this.timeoutInnactive);
        this.timeoutInnactive = null;
        this.inactif = false;
        // Vérifier si les événements d'orientation sont disponibles sur cette plateforme



        if (this.removeEvent === false) {

            this.removeEvent = true;

            if (!window.DeviceOrientationEvent || !window.DeviceOrientationEvent.requestPermission) {
                // alert("Oups! Votre fureteur ne supporte pas la détection d'orientation.");
                // return;
                window.addEventListener('deviceorientation', this.gererOrientation.bind(this));
                this.socket.emit("connection", {type: "connection", raquette: "rouleau"});

                // this.socket.emit("rouleau", {type : "rouleau"});


            }

            // Demande de permission à l'usager pour l'utilisation des événements d'orientation


            DeviceOrientationEvent.requestPermission()
                .then(state => {
                    if (state === 'granted') {
                        window.addEventListener('deviceorientation', this.gererOrientation.bind(this));
                        this.socket.emit("connection", {type: "connection", raquette: "rouleau"});

                        // this.socket.emit("rouleau", {type : "rouleau"});


                    }
                });


        }
    }


    autoriser3(e) {

        clearTimeout(this.timeoutInnactive);
        this.timeoutInnactive = null;
        this.inactif = false;
        // Vérifier si les événements d'orientation sont disponibles sur cette plateforme



        if (this.removeEvent === false) {

            this.removeEvent = true;

            if (!window.DeviceOrientationEvent || !window.DeviceOrientationEvent.requestPermission) {
                // alert("Oups! Votre fureteur ne supporte pas la détection d'orientation.");
                // return;
                window.addEventListener('deviceorientation', this.gererOrientation.bind(this));
                this.socket.emit("connection", {type: "connection", raquette: "spatule"});
                // this.socket.emit("spatule", {type : "spatule"});


            }

            // Demande de permission à l'usager pour l'utilisation des événements d'orientation


            DeviceOrientationEvent.requestPermission()
                .then(state => {
                    if (state === 'granted') {
                        window.addEventListener('deviceorientation', this.gererOrientation.bind(this));
                        this.socket.emit("connection", {type: "connection", raquette: "spatule"});

                        // this.socket.emit("spatule", {type : "spatule"});


                    }
                });
        }

    }


    gererOrientation(e) {


        this.socket.emit("mouvement", {type: "mouvement", alpha: e.alpha, beta: e.beta, gamma: e.gamma});


    }

    redirect(){
        window.location.href = "https://vremy.dectim.ca/chaos/interface/rejouer.html";
    }

    innactive(){
        window.location.href = "https://vremy.dectim.ca/chaos/interface/innactif.html";
    }

}