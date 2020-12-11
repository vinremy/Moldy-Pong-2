export class Interface {


    constructor() {

        this.socket = io("https://vremy.dectim.ca:3011", {
            query: {type: "interface"}
        });


        // Bouton pour demander la permission d'accéder aux données de positionnement
        document.querySelector("button").addEventListener("click", this.autoriser.bind(this));

        $('.carousel').carousel({
            interval: 2000
        })

    }
}

