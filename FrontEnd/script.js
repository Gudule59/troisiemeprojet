
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

    const imageElement = document.createElement ("img");
    imageElement.src=article.imageUrl;
    const titreElement = document.createElement ("p");
    titreElement.innerText = article.title;
  
    const gallery = document.querySelector(".gallery");
    gallery.appendChild(imageElement);
    gallery.appendChild(titreElement);
    
  }
});
