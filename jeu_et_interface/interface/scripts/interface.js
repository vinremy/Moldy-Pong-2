export class Interface {


    constructor() {

        this.socket = io("https://vremy.dectim.ca:3011", {
            query: {type: "Mika"}
        });


        this.removeEvent = false;


        // Bouton pour demander la permission d'accéder aux données de positionnement
        document.querySelector(".btnAutorise").addEventListener("click", this.autoriser.bind(this));
        document.querySelector(".btnAutorise2").addEventListener("click", this.autoriser2.bind(this));
        document.querySelector(".btnAutorise3").addEventListener("click", this.autoriser3.bind(this));

        this.socket.on("redirect", this.redirect.bind(this));

        this.socket.on("position", message => {
            document.getElementById("position").innerText = message.position;
        });

    }


    autoriser(e) {

        // Vérifier si les événements d'orientation sont disponibles sur cette plateforme



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
        window.location.href = "http://www.w3schools.com";
    }

}