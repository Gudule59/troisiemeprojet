
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
    const categoryId = document.createElement ("p");
    titreElement.innerText = article.categoryId;
    const categoryname = document.createElement ("p");
    titreElement.innerText = article.category.name;
    const category = document.createElement ("p");
    titreElement.innerText = article.category;

    gallery.appendChild(projetElement);
    projetElement.appendChild(imageElement);
    projetElement.appendChild(titreElement);
    
  }
// construction des boutons 

 const boutonTous = document.querySelector(".btn-tous");
 boutonTous.addEventListener("click", function () {
 console.log(works);
 
 });

 const boutonObjets = document.querySelector(".btn-objets");
 boutonObjets.addEventListener("click", function () {
  console.log(works);

});

 const boutonappartements = document.querySelector(".btn-appartements");
 boutonappartements.addEventListener("click", function () {
  console.log(works);

});

  const boutonhotel = document.querySelector(".btn-hotels");
  boutonhotel.addEventListener("click", function () {
    console.log(works);
    
});
});