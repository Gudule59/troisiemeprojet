
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






// variable (globale) permettant de stocker les données (issues de l'API) des travaux
let categories;
let works  ;

/**
 * fonction asynchrone qui récupère les catégories (Utilisation de THEN et ASYNC / AWAIT)
 */
const getCategories = async () => {
  await fetch("http://localhost:5678/api/categories")
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        console.log("la requête n'a pas abouti");
      }
    })
    .then((data) => {
      console.log(data);
      categories = data;
    });
};

/*
 * fonction asynchrone qui récupère les travaux (Cette syntaxe est nettement plus courte et plus claire que la précédente)
 */
const getWorks = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    // console.log(response);
    const data = await response.json();
    // console.table(data);
    return data;
  } catch (error) {
    console.log(`Un erreur est survenue : ${error}`);
  }
};

// Fonction qui affiche les travaux dans la page

const displayWorks = (works) => {

};

//Fonction qui affiche les boutons de filtre dans la page

const displayFilters = (categories) => {
  const filtre = document.querySelector('#portfolio .filtre');

  const boutonTousExistant = filtre.querySelector('.boutonTous');
  if (!boutonTousExistant) {
    const boutonTous = document.createElement('button');
    boutonTous.textContent = "Tous"; 
    boutonTous.classList.add('boutonObjets'); 
    boutonTous.setAttribute('data-categorie-id', 'all'); 
    filtre.appendChild(boutonTous);
  }

  categories.forEach((category) => {
    const bouton = document.createElement('button');
    bouton.textContent = category.name; 
    bouton.classList.add('boutonObjets'); 
    bouton.setAttribute('data-categorie-id', category.id); 
    filtre.appendChild(bouton); 

    bouton.addEventListener('click', () => {
      const idCategory = category.id;
      filterByCategory(idCategory);
    });
  });
};


/**
 * Fonction qui permet de filtrer les travaux par catégorie
 */
const filterByCategory = (idCategory) => {
  const filteredWorks = (idCategory === 'all') ? works : works.filter(work => work.categoryId === idCategory);
  displayWorks(filteredWorks);
};



/**
 * au chargement de la page
 */
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Au chargement de la page");

  // exécution de la fonction permmetant d'alimenter la variable works
  const works = await getWorks();

  await getCategories();
  displayWorks(works);
  displayFilters(categories);

  // Evénement Filtre par catégorie
  const filtre = document.querySelector('#portfolio .filtre');
  filtre.addEventListener('click', (event) => {
    const clickedButton = event.target;
    if (clickedButton.tagName === 'BUTTON') {
      const idCategory = clickedButton.getAttribute('data-categorie-id');
      filterByCategory(idCategory);
    }
  });
});