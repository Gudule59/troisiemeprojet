// variable (globale) permettant de stocker les données (issues de l'API) des travaux
let categories;
let travaux;
let modal = null;

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

    const imageElement = document.createElement("img");
    imageElement.src = works.imageUrl;
    const titreElement = document.createElement("p");
    titreElement.innerText = works.title;

    gallery.appendChild(projetElement);
    projetElement.appendChild(imageElement);
    projetElement.appendChild(titreElement);
  });
};

/**
 * Fonction qui affiche les boutons de filtre dans la page
 */
const displayFilters = (categories) => {
  const filtre = document.querySelector("#portfolio .filtre");

  const boutonTousExistant = filtre.querySelector(".boutonTous");
  if (!boutonTousExistant) {
    const boutonTous = document.createElement("button");
    boutonTous.textContent = "Tous";
    boutonTous.classList.add("boutonObjets");
    boutonTous.setAttribute("data-categorie-id", "all");
    filtre.appendChild(boutonTous);
  }

  categories.forEach((category) => {
    const bouton = document.createElement("button");
    bouton.textContent = category.name;
    bouton.classList.add("boutonObjets");
    bouton.setAttribute("data-categorie-id", category.id);
    filtre.appendChild(bouton);
  });
};

/**
 * Fonction qui permet de filtrer les travaux par catégorie
 */
const filterByCategory = (idCategory) => {
  const gallery = document.querySelector("#portfolio .gallery");
  const elements = gallery.querySelectorAll("article");
  console.log(elements);
  elements.forEach((element) => {
    const elementCategory = element.getAttribute("categoryId");

    if (idCategory === "all" || idCategory === elementCategory) {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  });
};

/**
 * Function to check if the user is connected using a stored token.
 *
 * @return {boolean} true if connected, false if not connected
 */
function checkConnexion() {
  const token = localStorage.getItem("token");
  console.log(token);
  if (token) {
    return true;
  } else {
    return false;
  }
}

/**
 * Display the appropriate context based on the user's connection state.
 *
 * @param None
 * @return None
 */
function displayContext() {
  const modifBtn = document.getElementById("modif");
  const bandeau = document.getElementById("bandeau");
  const loginBtn = document.getElementById("loginLogoutLink");

  const state = checkConnexion();
  console.log(`Connecté : ${state}`);

  if (state) {
    modifBtn.style.display = "flex";
    bandeau.style.display = "block";
    loginBtn.textContent = "Logout";
    loginBtn.href = "";
  } else {
    modifBtn.style.display = "none";
    bandeau.style.display = "none";
    loginBtn.textContent = "Login";
    loginBtn.href = "./login.html";
  }
}

/**
 * Logs the user out by preventing the default event, clearing the local storage,
 * and displaying the button as connected.
 *
 * @param {object} event - The event object
 * @return {void}
 */
function logout(event) {
  event.preventDefault();
  localStorage.clear();
  displayContext();
}

/**
 * Redirects the user to the login page.
 *
 * @param {Event} event - The event object.
 * @return {void} This function does not return a value.
 */
function login(event) {
  event.preventDefault();
  window.location.href = "./login.html";
}


const fillSelectWithOptions = async () => {  // Recuperation des categories et integration au bouton select
  const selectCategorie = document.querySelector('.selectCategorie');

  try {
    // Appel à la fonction getCategories pour récupérer les catégories depuis l'API
    await getCategories(); 
    console.log(getCategories);

   
    if (categories && categories.length > 0) {
      // Parcourez les catégories et ajoutez-les au bouton select
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        selectCategorie.appendChild(option);
      });
    } else {
      console.log("Aucune catégorie n'a été récupérée depuis l'API.");
    }
  } catch (error) {
    console.error("Une erreur s'est produite lors du chargement des catégories :", error);
  }
};

// Exécutez fillSelectWithOptions lorsque le DOM est entièrement chargé
document.addEventListener('DOMContentLoaded', async () => {
  await fillSelectWithOptions(); // Attendre que fillSelectWithOptions se termine
});





const displayAjouterModal = async (travaux) => {
  const modal = document.getElementById("titremodal");
  const article = document.createElement("article");
  article.classList.add('Ajouter-modal'); 

  const ensembleImage= document.createElement("div");
  ensembleImage.classList.add('ensembleImage'); 

  const imageAjouter= document.createElement("img");
  imageAjouter.classList.add('imageAjouter'); 

  const btnAjouterImage= document.createElement("button");
  btnAjouterImage.textContent = "+ Ajouter photo";
  btnAjouterImage.classList.add('btnAjouterImage'); 

  const infoFormatTaille= document.createElement("label");
  infoFormatTaille.textContent = "jpg, png : 4mo max";
  infoFormatTaille.classList.add('infoFormatTaille'); 

  const labelTitre= document.createElement("label");
  labelTitre.textContent = "Titre";
  labelTitre.classList.add('titreSelect');

  
  const titreNouvelleImage = document.createElement("input");
  titreNouvelleImage.setAttribute("type", "text");
  const labelCategorie = document.createElement("label");
  labelCategorie.textContent = "Catégorie";
  labelCategorie.classList.add('categorieSelect');
  titreNouvelleImage.classList.add('titreNouvelleImage'); 
  const selectCategorie = document.createElement("select");
  selectCategorie.classList.add('selectCategorie'); 



  modal.insertAdjacentElement('afterend', article);

  article.appendChild(ensembleImage);   // div prinviap
 ensembleImage.appendChild(imageAjouter);   // img avec une fonction
 ensembleImage.appendChild(btnAjouterImage);   // bouton 
 ensembleImage.appendChild(infoFormatTaille);   // label avec le message

  article.appendChild(labelTitre);
  article.appendChild(titreNouvelleImage);
  article.appendChild(labelCategorie);
  article.appendChild(selectCategorie);
  fillSelectWithOptions();
};








const displayThumbnailsModal = (travaux) => {
 // const modalContent = document.querySelector("#modal .modal-content");
 // modalContent.innerHTML = ''; // Efface le contenu précédent de la modal
 const modal = document.getElementById("titremodal"); // Sélectionnez l'élément de la modale
 const article = document.createElement("article");
 article.classList.add('thumbnail'); 

  travaux.forEach((works) => {
    const gallerieImage = document.createElement("div");
    gallerieImage.setAttribute("categoryId", works.category.id);
   

    // Créez une vignette pour chaque image
    const thumbnailImage = document.createElement("img");
    thumbnailImage.src = works.imageUrl;
    thumbnailImage.classList.add('thumbnailImage'); // Ajoutez une classe pour le style CSS


    modal.insertAdjacentElement('afterend', article);
    article.appendChild(gallerieImage);
    gallerieImage.appendChild(thumbnailImage);
  //  modal.appendChild(projetElement);
  });
};

const openModalAjout = async function (event) {
  console.log(event);
  event.preventDefault();
  titreGaleriemodal = document.getElementById('titremodal');
  titreGaleriemodal.textContent = "Ajouter une photo"; 
  modal = document.getElementById("modal");
  const stopElement = modal.querySelector('.modal-stop');
  stopElement.addEventListener('click', stopPropagation);
  const closebtn = modal.querySelector('.close-btn');
  closebtn.addEventListener('click', closeModal);
  displayAjouterModal();

  
  if (modal) {
    modal.style.display = "flex";
    backBtn = document.getElementById('back-btn');
    backBtn.style.display = "block";
    clearModalContent();
    modal.addEventListener("click", closeModal);
  }

  };

const openModal = async function (event) {
  console.log(event);
  event.preventDefault();
  titreGaleriemodal = document.getElementById('titremodal');
  titreGaleriemodal.textContent = "Galerie Photo"; 
  modal = document.getElementById("modal");
  const stopElement = modal.querySelector('.modal-stop');
  stopElement.addEventListener('click', stopPropagation);
  const closebtn = modal.querySelector('.close-btn');
  closebtn.addEventListener('click', closeModal);
   const works = await getWorks(); // on attends les elements de l'api
   displayThumbnailsModal(works); // on les ajoutent


 
  if (modal) {
    modal.style.display = "flex";
    backBtn = document.getElementById('back-btn');
    backBtn.style.display = "none";
    const modalBtn = document.querySelector('.modal-btn');
    modalBtn.justifyContent= "end";
    modal.addEventListener("click", closeModal);
  }
};

const stopPropagation = function (event) {
  event.stopPropagation()
};

const clearModalContent = () => {
  const modalthumbnail = document.querySelector("#modal  .thumbnail");
  modalthumbnail.innerHTML = ''; 
};



const closeModal = function (event) {
  event.preventDefault();
  clearModalContent();
  modal.style.display = "none";
  modal.removeEventListener("click", closeModal);
  modal = null;
};

/**
 * Au chargement de la page (une fois que le DOM est chargé correctement)
 */
document.addEventListener("DOMContentLoaded", async function () {
  // affichage contextualisé des boutons et bandeau
  displayContext();
  
  // Événement pour le bouton de connexion
  const loginBtn = document.getElementById("loginLogoutLink");
  loginBtn.addEventListener("click", function (event) {
    const state = checkConnexion();
    if (state) {
      logout(event);
    } else {
      login(event);
    }
  });

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
  const filtre = document.querySelector("#portfolio .filtre");
  filtre.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      const idCategory = event.target.getAttribute("data-categorie-id");
      filterByCategory(idCategory);
    }
  });

  // Evenement pour ouvrir la modale
  const modifBtn = document.getElementById("modif");
  modifBtn.addEventListener("click", openModal);

const backBtn = document.getElementById("back-btn");
backBtn.addEventListener("click", openModal);

const modalBtnEnvoyer = document.getElementById("modal-btn-envoyer");
modalBtnEnvoyer.addEventListener("click", openModalAjout);
});
