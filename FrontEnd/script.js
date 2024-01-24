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
    projetElement.setAttribute("categoryId", works.category.id);

    const imageElement = document.createElement ("img");
    imageElement.src=works.imageUrl;
    const titreElement = document.createElement ("p");
    titreElement.innerText = works.title;
  

    gallery.appendChild(projetElement);
    projetElement.appendChild(imageElement);
    projetElement.appendChild(titreElement);
    
  })

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


  });
};


/**
 * Fonction qui permet de filtrer les travaux par catégorie
 */
const filterByCategory = (idCategory) => {
  const gallery = document.querySelector("#portfolio .gallery");
  const elements = gallery.querySelectorAll('article');
  console.log(elements)
  elements.forEach((element) => {
    const elementCategory = element.getAttribute('categoryId');

    if (idCategory === 'all' || idCategory === elementCategory ) {
      element.style.display = 'block'; 
    } else {
      element.style.display = 'none'; 
    }
  });
};

/**
 * au chargement de la page
 */
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Au chargement de la page");

  // exécution de la fonction permettant d'alimenter la variable works
  const works = await getWorks();
  console.log(works);

  // exécution de la fonction permettant d'alimenter la variable globale categories
  await getCategories();
  console.log(categories);

  // exécution de la fonction qui affiche les travaux
  displayWorks(works);

  // exécution de la fonction qui affiche les filtres
  displayFilters(categories);

  // Evénement Filtre par catégorie
  const filtre = document.querySelector('#portfolio .filtre');
  filtre.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const idCategory = event.target.getAttribute('data-categorie-id');
      filterByCategory(idCategory);
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Récupérer le lien et définir le gestionnaire d'événements
  MajLien();
  const connexion = document.getElementById('loginLogoutLink');
  connexion.addEventListener('click', MajLien);

  // Vérifier l'état de connexion au chargement de la page
  ChangementEtatConnexion();
});

function ChangementEtatConnexion(event) {
  event.preventDefault();

  // Inverser l'état de connexion
  const connecte = localStorage.getItem('connecte') === 'true';
  localStorage.setItem('connecte', (!connecte).toString());


  MajLien();
}

function MajLien() {   // Mettre à jour l'apparence du lien
  const connecte = localStorage.getItem('connecte') === 'true';
  const connexion = document.getElementById('loginLogoutLink');

  if (connecte) {
    connexion.innerHTML = '<a href="./index.html">Logout</a>';
    const affichage = document.getElementById("modif")
    const affichage1 = document.getElementById("bandeau")
    affichage.style.display = "block";
    affichage1.style.display = "block";
  } else {
    connexion.innerHTML = '<a href="./login.html">Login</a>';
    const affichage = document.getElementById("modif")
    const affichage1 = document.getElementById("bandeau")
    affichage.style.display = "none";
    affichage1.style.display = "none";
  }
}
