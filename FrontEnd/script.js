
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
// construction des boutons 

 });






// variable (globale) permettant de stocker les données (issues de l'API) des travaux
let categories;

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

/**
 * Fonction qui affiche les travaux dans la page
 */
const displayWorks = (works) => {
  console.log(works);
  // on peut maintenant afficher les travaux dans la page
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
    boutonTous.classList.add('boutonObjets'); // Ajoutez une classe pour les styles CSS ou pour la sélection en JavaScript si nécessaire
    boutonTous.classList.add('boutonTous'); // Ajoutez une classe spécifique pour identifier le bouton "Tous"
    filtre.appendChild(boutonTous);
  }

 
  categories.forEach((category) => {
    const bouton = document.createElement('button');
    bouton.textContent = category.name; 
    bouton.classList.add('boutonObjets'); 
    bouton.setAttribute('data-categorie-id', category.id); 


    // Écouteur d'événement pour gérer le clic sur le bouton de catégorie
    bouton.addEventListener('click', () => {
      // Action à effectuer lors du clic sur un bouton de catégorie
      // Par exemple, filtrer les travaux en fonction de la catégorie sélectionnée
      const travauxFiltres = getTravauxByCategorieId(category.id); // Fonction hypothétique pour filtrer les travaux
      displayWorks(travauxFiltres); // Afficher les travaux filtrés
    });

    filtre.appendChild(bouton); // Ajout du bouton de catégorie au conteneur de filtres
  });
};

// Exemple d'utilisation avec les catégories récupérées
getCategories()
  .then((categories) => {
    displayFilters(categories); // Appel à la fonction pour afficher les boutons de catégorie
  })
  .catch((error) => {
    console.error('Erreur lors de la récupération des catégories :', error);
  });



/**
 * Fonction qui permet de filtrer les travaux par catégorie
 */
const filterByCategory = (idCategory, works) => {
  console.log(idCategory);
  console.log(works);
  // on peut maintenant filtrer les travaux par catégorie (A REDIGER !!!)
};

/**************************************************************************** */
/**
 * au chargement de la page
 */
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Au chargement de la page");

  // exécution de la fonction permmetant d'alimenter la variable works
  const works = await getWorks();
  console.log(works);

  // exécution de la fonction permmetant d'alimenter la variable globale categories
  await getCategories();
  console.log(categories);

  // exécution de la fonction qui affiche les travaux
  displayWorks(works);

  // exécution de la fonction qui affiche les filtres
  displayFilters(categories);

  // Evénement Filtre par catégorie
  boutonObjets.addEventListener("click", function (clic) {
    // ON commence par récupérer l'ID du bouton Cliqué (qui correspond à l'ID de la catégorie pour le filtre)
    //console.log(clic);
    //console.log("TARGET : ", clic.target);
    const idCategory = clic.target.id;
    //console.log(idCategory);

    // UNE fois qu'on a l'ID de la catégorie, on peut filtrer
    // reponse(idCategory);
    filterByCategory(idCategory);
  });
});