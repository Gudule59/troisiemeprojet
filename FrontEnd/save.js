// variable (globale) permettant de stocker les données (issues de l'API) des travaux
let categories;
let travaux  ;
/**
 * fonction asynchrone qui récupère les catégories (Utilisation de THEN et ASYNC / AWAIT)
 */
const getCategories = async () => {
  await fetch("http://localhost:5678/api/categories")
    .then((response) => {
      // console.log(response);
      // une fois qu'on a une réponse de l'API, on vérifie que le statut de la promesse est 200, et si oui, on renvoie les données au format JSON
      if (response.status === 200) {
        //console.log(response.json());
        return response.json();
      } else {
        console.log("la requête n'a pas abouti");
      }
    })
    .then((data) => {
      // console.log(data);
      // une fois qu'on a les données de l'API, on alimente la variable globale (categories) avec les données
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

/**
 * Fonction qui affiche les travaux dans la page
 */
const displayWorks = (travaux) => {

  travaux.forEach((works) => {
    const gallery = document.querySelector("#portfolio .gallery");
    const projetElement = document.createElement("article");

    const imageElement = document.createElement ("img");
    imageElement.src=works.imageUrl;
    const titreElement = document.createElement ("p");
    titreElement.innerText = works.title;
  

    gallery.appendChild(projetElement);
    projetElement.appendChild(imageElement);
    projetElement.appendChild(titreElement);
    
  })

};

/**
* Fonction qui permet de filtrer les travaux par catégorie
*/
const filterByCategory = (idCategory) => {
  const gallery = document.querySelector("#portfolio .gallery");
  const elements = gallery.querySelectorAll('article');
 
  elements.forEach(element => {
    const elementCategory = element.getAttribute('data-categorie-id');
    if (idCategory === 'all' || idCategory === elementCategory) {
      element.style.display = 'block'; // Afficher l'élément si la catégorie correspond ou si "Tous" est sélectionné
    } else {
      element.style.display = 'none'; // Masquer l'élément si la catégorie ne correspond pas
    }
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
 
    bouton.addEventListener('click', () => {
      const idCategory = category.id;
      filterByCategory(idCategory);
    });
  });
 };
 
 
/**************************************************************************** */
/**
 * au chargement de la page
 */

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Au chargement de la page");

  // exécution de la fonction permettant d'alimenter la variable works
  const works = await getWorks();
  // exécution de la fonction permettant d'alimenter la variable globale categories
  await getCategories();
  // exécution de la fonction qui affiche les travaux
  displayWorks(works);
  // exécution de la fonction qui affiche les filtres
  displayFilters(categories);

  // Écouteur d'événements pour le filtrage des travaux au clic sur un bouton de catégorie
  document.querySelector('#portfolio .filtre').addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const idCategory = event.target.getAttribute('data-categorie-id');
      filterByCategory(idCategory);
    }
  });
});