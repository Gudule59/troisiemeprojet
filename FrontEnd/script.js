
// On récupère la liste des travaux depuis l'API via FETCH
fetch("http://localhost:5678/api/works")
  .then((res) => {
    // 1/ on vérifie que le retour de l'API est exploitable
    console.log(res);
    if (res.ok === true) {
      console.log("DONNEES RECUES DE L'API");
      return res.json();
    } else {
      console.log("erreur API");
    }
  })
  .then((works) => {
    // 2/ on exploite le jeu de données (JSON)
    console.log(works);

    for (let i = 0; i < works.length; i++) {

    const article = works[i];
    const gallery = document.querySelector("#portfolio .gallery");
    const projetElement = document.createElement("article");

    const imageElement = document.createElement ("img");
    imageElement.src=article.imageUrl;
    const titreElement = document.createElement ("p");
    titreElement.innerText = article.title;
  
    gallery.appendChild(projetElement);
    projetElement.appendChild(imageElement);
    projetElement.appendChild(titreElement);
    
  }
});

const boutonTous = document.querySelector(".btn-tous");

boutonTous.addEventListener("click", function () {

  });

   const boutonobjet = document.querySelector(".btn-objet");

boutonobjet.addEventListener("click", function () {

   });

   const boutonappartements = document.querySelector(".btn-appartements");

boutonappartements.addEventListener("click", function () {

});

   const boutonhotel = document.querySelector(".btn-hotel");

boutonhotel.addEventListener("click", function () {

});