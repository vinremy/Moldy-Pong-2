export class Interface {


    constructor() {

        this.socket = io("https://vremy.dectim.ca:3011", {
            query: {type: "interface"}
        });






        // Bouton pour demander la permission d'accéder aux données de positionnement
        document.querySelector("button").addEventListener("click", this.autoriser.bind(this));





    }



    autoriser(e) {

        // Vérifier si les événements d'orientation sont disponibles sur cette plateforme


        if (!window.DeviceOrientationEvent || !window.DeviceOrientationEvent.requestPermission) {
            // alert("Oups! Votre fureteur ne supporte pas la détection d'orientation.");
            // return;
            window.addEventListener('deviceorientation', this.gererOrientation.bind(this));
            this.socket.emit("connection", {type : "connection"});

        }

        // Demande de permission à l'usager pour l'utilisation des événements d'orientation


        DeviceOrientationEvent.requestPermission()
            .then(state => {
                if (state === 'granted') {
                    window.addEventListener('deviceorientation', this.gererOrientation.bind(this));
                    this.socket.emit("connection", {type : "connection"});
                }
            });




    }







    gererOrientation(e) {


        this.socket.emit("mouvement", {type : "mouvement" ,alpha: e.alpha, beta: e.beta, gamma: e.gamma});

    }



}