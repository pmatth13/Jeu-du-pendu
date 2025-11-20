const mots = ["ORDINATEUR","JAVASCRIPT","CROCODILE","PARACHUTE","ELEPHANT","PYRAMIDE","CHOCOLAT","GUITARE", "MONTAGNE","DINOSAURE","TELEPHONE","RESTAURANT","AVENTURE","CAMPAGNE","BIBLIOTHEQUE","PAPILLON","FLAMANT","CYCLONE","VOLCAN","PENDU"];
const alphabet = [
    "AZERTYUIOP",
    "QSDFGHJKLM",
    "WXCVBN"
];
const partiesCorps = ["tete", "corps", "bras-gauche","bras-droit","jambe-gauche", "jambe-droite"];

let motSecret = "";
let lettresTrouvees = [];
let nbErreurs =0;
let maxErreurs= 6;

/*------------------------Initialisation du jeu------------------------------ */

function choisirMotAleatoire () {
    let indexAleatoire = Math.floor(Math.random()*mots.length);
    motSecret = mots[indexAleatoire];
}

function afficherMot(){
    let affichage = motSecret
    .split ("")
    .map(lettre => lettresTrouvees.includes(lettre) ? lettre : "_")
    .join (" ");
    
    document.getElementById("mot-affiche").textContent = affichage;
}

/*------------------------Créer l'alphabet ---------------------------------*/

function creerAlphabet(){
    let zoneAlphabet = document.getElementById("alphabet")
    alphabet.forEach(rangee=>{
        const divRangee = document.createElement("div");
        divRangee.classList.add("rangee-clavier");

        rangee.split("").forEach(lettre => {
        const btn = Object.assign(document.createElement("button"),{
            className : "lettre",
            textContent: lettre
        });

        divRangee.appendChild(btn);
            btn.addEventListener("click",() => {
            verifierLettre(lettre, btn);
            });
        });

        zoneAlphabet.appendChild(divRangee);
    });
};

function verifierLettre (lettre, btn){
    btn.disabled = true;
    if (motSecret.includes(lettre)){
        btn.classList.add("utilisee");
        lettresTrouvees.push(lettre);
        afficherMot();

        if(verifierVictoire()){
            finDePartie(true);
        }

    } else {
        btn.classList.add("erreur");
        nbErreurs++;
        document.getElementById("compteur-erreurs").textContent = nbErreurs;
        dessinerPendu();

        if (verifierDefaite()){
            finDePartie(false);
        }
    }
}

/*---------------------------------Dessiner le pendu -----------------------------*/
function dessinerPendu(){
    let partieId = partiesCorps[nbErreurs - 1];
    let membre = document.getElementById(partieId);
    membre.classList.remove("cache");
}
/*--------------------------------Proposer un mot-------------------------------*/

function proposerMot(){
    let proposition = document.getElementById("proposition-mot").value.toUpperCase().trim();
    if(proposition === ""){
        alert("Ecrire un mot valide");
        return;
    }

    if(proposition === motSecret){
        lettresTrouvees = [...motSecret];
        afficherMot();
        finDePartie (true);

    }else { 
        nbErreurs++;
        document.getElementById("compteur-erreurs").textContent = nbErreurs;
        dessinerPendu();
        document.getAnimations("proposition-mot").value="";
        if (verifierDefaite()) {
            finDePartie(false);
        }
    }
}

/*---------------------------- FIN DU JEU --------------------------------------*/
function verifierVictoire () {
    return motSecret.split("").every(lettre => lettresTrouvees.includes(lettre));
}

function verifierDefaite () {
    return nbErreurs >= 6;
};



function finDePartie (victoire) {
    const message = document.getElementById("message");
    message.classList.remove("cache");

    if(victoire) {
        message.textContent = `Bravo ! Le mot était : ${motSecret}`;
        message.classList.add("victoire");
        message.classList.remove("defaite");
    }else {
        message.textContent = `Perdu ! Le mot était : ${motSecret}`;
        message.classList.add("defaite");
        message.classList.remove("victoire");
    }
    document.getElementById("btn-rejouer").classList.remove("cache");
    document.querySelectorAll(".lettre").forEach(btn => {
        btn.disabled = true;
    });

    document.getElementById("proposition-mot").disabled = true;
    document.getElementById("btn-valider").disabled = true;
}

/*----------------------------------Nouvelle Partie-----------------------------------*/
document.getElementById("btn-valider").addEventListener("click", proposerMot);
document.getElementById("btn-rejouer").addEventListener("click", function() {
    location.reload();
});

choisirMotAleatoire();
console.log("Mot secret :" , motSecret);
creerAlphabet();
afficherMot();