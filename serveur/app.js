// Code de test rapide *****************************************************************************
// let http = require('http');
//
// let compteur = 0;
//
// let serveur = http.createServer((requete, reponse) => {
//   reponse.end("Allo! #" + ++compteur);
// })
//
// serveur.listen(3000, () => {
//   console.log("Serveur fonctionnel sur le port", serveur.address().port);
// })
// *************************************************************************************************


// Importation des modules nécessaires
const fs = require('fs');
const https = require('https');
const path = require('path');
const SocketIO = require('socket.io');

// Configurations
const config = {
  adresse: "vremy.dectim.ca",  // Doit être la même adresse que celle du certificat SSL!
  port: 3011,                   // Doit être exclusif à chaque équipe!
  certificat: fs.readFileSync(path.resolve() + '/securite/certificat.pem'),
  cle: fs.readFileSync(path.resolve() + '/securite/cle.pem')
}

// Instantiation d'un serveur HTTP et d'un serveur de WebSocket utlisant le serveur HTTP comme
// couche de transport



const serveur = https.createServer({ key: config.cle, cert: config.certificat });
const io = SocketIO(serveur);

// Démarrage du serveur HTTP
serveur.listen(config.port, config.adresse, () => {
  console.log("Le serveur est prêt et écoute sur le port " + serveur.address().port);
});

// Liste des connexions de toutes les interfaces (appareils mobiles)
let interfaces = [];

// Liste des connexions de tous les jeux (pages web)
let jeux = [];

// Mise en place d'un écouteur pour traiter les connexions de client et les données envoyées par
// ceux-ci.
io.on("connection", socket => {

  // On vérifie si la connexion provient d'une interface ou d'un jeu
  if (socket.handshake.query.type === "Mika") {
    gererNouvelleInterface(socket);
  } else if (socket.handshake.query.type === "jeu") {
    gererNouveauJeu(socket);
  } else {
    console.log("connection refusé");
    socket.disconnect();
  }

});





function gererNouvelleInterface(socket) {

  console.log("Connexion d'une interface");

  if (!interfaces[0]) {
    interfaces[0] = socket;
    socket.on("mouvement", message => {
      jeux.forEach(jeu => jeu.emit("joueur1", message))
    });

      socket.on("connection", message => {
          jeux.forEach(jeu => jeu.emit("connection1", message))
      });


      socket.on("finJeu", message => {
          interfaces[0].emit("redirect", {type: "redirect", message});
      });



  } else if (!interfaces[1]) {
    interfaces[1] = socket;
    socket.on("mouvement", message => {
      jeux.forEach(jeu => jeu.emit("joueur2", message))
    });

      socket.on("connection", message => {
          jeux.forEach(jeu => jeu.emit("connection2", message))
      });
      socket.on("finJeu", message => {
          interfaces[1].emit("redirect", {type: "redirect", message});
      });


  } else {
    interfaces.push(socket);
  }

    interfaces.forEach((interface, index) => {
        if (!interface) return;
        interface.emit("position", {position: index})
    })

  // Ajout d'un écouteur pour détecter la déconnexion d'une interface
  socket.on('disconnect', () => {

    socket.emit("disconnected", socket);

    // Identification de l'index de l'interface qui vient de se déconnecter
    const index = interfaces.indexOf(socket);

    console.log("Déconnexion de l'interface: ", index);

    if (index === 0) {
      interfaces[0] = null;
    } else if (index === 1) {
      interfaces[1] = null;
    } else {
      interfaces.splice(index, 1);
    }

    // Envoyer une mise à jour à toutes les interfaces pour identifer leur position dans la liste
      interfaces.forEach((interface, index) => {
          if (interface === null) return;
          interface.emit("position", {position: index})
      })
  })



}

function gererNouveauJeu(socket) {

  console.log("Connexion d'une page web de jeu");

  jeux.push(socket);

  socket.on('disconnect', () => {
      console.log("Déconnexion d'une page de jeu!");
      jeux = jeux.filter(item => item !== socket)
  });

}




// io.on("finJeu", finDeJeu());
//
// function finDeJeu() {
//
//   interfaces[0].emit("redirect", {type: "redirect"});
//   interfaces[1].emit("redirect", {type: "redirect"});
//
//
// }
//




