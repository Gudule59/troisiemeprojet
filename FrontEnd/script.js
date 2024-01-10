// variable (globale) permettant de stocker les données (issues de l'API) des travaux
let categories;

/**
 * fonction asynchrone qui récupère les catégories (Utilisation de THEN et ASYNC / AWAIT)
 */
const getCategories = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (response.status === 200) {
      return response.json();
    } else {
      console.log("La requête n'a pas abouti");
    }
  } catch (error) {
    console.log(`Une erreur est survenue : ${error}`);
  }
};

/*
 * fonction asynchrone qui récupère les travaux (Cette syntaxe est nettement plus courte et plus claire que la précédente)
 */
const getWorks = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (response.status === 200) {
      return response.json();
    } else {
      console.log("La requête n'a pas abouti");
    }
  } catch (error) {
    console.log(`Une erreur est survenue : ${error}`);
  }
};

/**
 * Fonction qui affiche les travaux dans la page
 */
const displayWorks = (travaux) => {
  const gallery = document.querySelector("#portfolio .gallery");
  gallery.innerHTML = ''; // Nettoie la galerie avant d'ajouter les éléments

  travaux.forEach((works) => {
    const projetElement = document.createElement("article");
    const imageElement = document.createElement("img");
    imageElement.src = works.imageUrl;
    const titreElement = document.createElement("p");
    titreElement.innerText = works.title;

    projetElement.appendChild(imageElement);
    projetElement.appendChild(titreElement);

    gallery.appendChild(projetElement);
  });
};


/**
 * Fonction qui affiche les boutons de filtre dans la page
 */
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
  
    bouton.addEventListener('click', (event) => {
      const idCategory = event.target.getAttribute('data-categorie-id');
      filterByCategory(idCategory);
    });
  });
  
};



/**
 * Fonction qui permet de filtrer les travaux par catégorie
 */
const filterByCategory = (idCategory) => {
  const gallery = document.querySelector("#portfolio .gallery");
  const elements = gallery.querySelectorAll('article');
  const test = gallery.querySelectorAll('data-categorie-id')

  elements.forEach(element => {
    const elementCategory = element.getAttribute('data-categorie-id');
    if (idCategory === 'all' || idCategory === elementCategory ) {
      element.style.display = 'block'; // Afficher l'élément si la catégorie correspond ou si "Tous" est sélectionné
    } else {
      element.style.display = 'none'; // Masquer l'élément si la catégorie ne correspond pas
    }
  });
};





/**
 * Au chargement de la page
 */
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Au chargement de la page");

  // Exécution de la fonction permettant d'alimenter la variable 'works'
  const works = await getWorks();

  // Exécution de la fonction permettant d'alimenter la variable globale 'categories'
  categories = await getCategories();

  // Exécution de la fonction qui affiche les travaux
  displayWorks(works);

  // Exécution de la fonction qui affiche les filtres
  displayFilters(categories);

  // Écouteur d'événements pour le filtrage des travaux au clic sur un bouton de catégorie
  document.querySelector('#portfolio .filtre').addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const idCategory = event.target.getAttribute('data-categorie-id');
      filterByCategory(idCategory);
    }
  });
});
