// variable (globale) permettant de stocker les données (issues de l'API) des travaux
let categories;
let travaux;
let modal = null;
let imageUrl;

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

    if (categories && categories.length > 0) {
      // Ajout de l'option vide par défaut
      const defaultOption = document.createElement('option');
      defaultOption.value = ''; // La valeur de l'option vide est vide
      defaultOption.textContent = ''; // Texte à afficher dans l'option vide
      defaultOption.selected = true; // Option sélectionnée par défaut
      selectCategorie.appendChild(defaultOption);

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


const creationElementModalAjouter = async () => {
  const modal = document.getElementById("titremodal");
  const article = document.createElement("article");
  article.classList.add('Ajouter-modal');
  const mainConteneur = document.createElement("div");
  article.classList.add('mainConteneur');
  mainConteneur.id = 'mainConteneur';

  const ensembleImage = document.createElement("div");
  ensembleImage.classList.add('ensembleImage');
  ensembleImage.id = 'ensembleImage';

  const MessageErreur = document.createElement("label");
  MessageErreur.classList.add('alertajout');
  MessageErreur.id = 'MessageErreur';
  const imagePreviewContainer = document.createElement("div");
  imagePreviewContainer.classList.add('image-preview-container');
  imagePreviewContainer.id = 'imagePreviewContainer';
  const imageAjouter = document.createElement("img");
  imageAjouter.src = "./assets/icons/image-regular.svg";
  imageAjouter.classList.add('imageAjouter');
  imageAjouter.id = 'imageInput';


  const btnAjouterImage = document.createElement("input");
  btnAjouterImage.setAttribute('type', 'file');
  btnAjouterImage.setAttribute('name', 'nouveauNom');
  btnAjouterImage.classList.add('hidden-input');
  btnAjouterImage.id = 'btnAjouterImage';
  const btnAjouterLabel = document.createElement("label");
  btnAjouterLabel.setAttribute('for', 'btnAjouterImage');
  btnAjouterLabel.textContent = "+ Ajouter une image";
  btnAjouterLabel.classList.add('btnAjouterImage');


  const infoFormatTaille = document.createElement("label");
  infoFormatTaille.textContent = "jpg, png : 4mo max";
  infoFormatTaille.classList.add('infoFormatTaille');
  infoFormatTaille.id = 'infoFormatTaille';

  const labelTitre = document.createElement("label");
  labelTitre.textContent = "Titre";
  labelTitre.classList.add('titreSelect');

  const titreNouvelleImage = document.createElement("input");
  titreNouvelleImage.setAttribute("type", "text");
  titreNouvelleImage.classList.add('titreNouvelleImage');
  titreNouvelleImage.setAttribute("required", "required");
  titreNouvelleImage.id = 'titreNouvelleImage';

  const labelCategorie = document.createElement("label");
  labelCategorie.textContent = "Catégorie";
  labelCategorie.classList.add('categorieSelect');


  const selectCategorie = document.createElement("select");
  selectCategorie.classList.add('selectCategorie');
  selectCategorie.id = 'selectCategorie';

  modal.insertAdjacentElement('afterend', article);

  article.appendChild(mainConteneur);
  mainConteneur.appendChild(MessageErreur);
  mainConteneur.appendChild(ensembleImage);   // div principal

  ensembleImage.appendChild(imageAjouter);   // img avec une fonction
  ensembleImage.appendChild(btnAjouterLabel);
  ensembleImage.appendChild(btnAjouterImage);   // bouton 
  ensembleImage.appendChild(infoFormatTaille);   // label avec le message
  ensembleImage.appendChild(imagePreviewContainer);

  mainConteneur.appendChild(labelTitre);
  mainConteneur.appendChild(titreNouvelleImage);
  mainConteneur.appendChild(labelCategorie);
  mainConteneur.appendChild(selectCategorie);

  checkInputs();

}



/** creation de la modale ajout photos */

const displayAjouterModal = async (travaux) => {
  creationElementModalAjouter();
  fillSelectWithOptions();
  Imageuser();

  if (modal) {
    modal.style.display = "flex";
    backBtn = document.getElementById('back-btn');
    backBtn.style.display = "none";
    modalBtnValider = document.getElementById('modal-btn-valider');
    modalBtnValider.style.display = "none";
    modalBtnEnvoyer = document.getElementById('modal-btn-envoyer');
    modalBtnEnvoyer.style.display = "block";
    const modalBtn = document.querySelector('.modal-btn');
    modalBtn.justifyContent = "end";
    modal.addEventListener("click", closeModal);
  }


};

/** permet de mettre les travaux en vignettes dans la modal */
const displayThumbnailsModal = (travaux) => {
  const modal = document.getElementById("titremodal");
  const article = document.createElement("article");
  article.classList.add('thumbnail');

  travaux.forEach((works) => {
    const gallerieImage = document.createElement("div");
    gallerieImage.setAttribute("categoryId", works.category.id);


    // Créez une vignette pour chaque image
    const thumbnailImage = document.createElement("img");
    thumbnailImage.src = works.imageUrl;
    thumbnailImage.classList.add('thumbnailImage'); // Ajoutez une classe pour le style CSS

    const imageDelete = document.createElement('button');
    imageDelete.classList.add('delete-btn');
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-trash');
    // Ajoutez un gestionnaire d'événements au bouton si nécessaire
    imageDelete.addEventListener('click', () => {
      deleteTravaux(works.id)
    });

    modal.insertAdjacentElement('afterend', article);
    article.appendChild(gallerieImage);
    gallerieImage.appendChild(thumbnailImage);
    gallerieImage.appendChild(imageDelete);
    imageDelete.appendChild(icon);


  });

};
/** permet de supprimer des travaux  */
const deleteTravaux = (workId) => {

  const token = localStorage.getItem("token");
  console.log('je verifie le token => ' + token)

  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`, // Ajout du token d'authentification dans l'en-tête
      'Accept': '*/*'
    }
  })
    .then(response => {
      if (response.ok) {
        // L'image a été supprimée avec succès, vous pouvez faire quelque chose si nécessaire
        console.log('Image supprimée avec succès');
      } else {
        throw new Error('Erreur lors de la suppression de l\'image');
      }
    })
    .catch(error => {
      console.error('Erreur:', error);
    });
};


/** permet de creer la modal pour ajouter des images   */
const openModalAjout = async function (event) {
  console.log(event);
  event.preventDefault();
  titreGaleriemodal = document.getElementById('titremodal');
  titreGaleriemodal.textContent = "Ajouter une photo";
  modalAjout = document.getElementById("modal");
  const stopElement = modal.querySelector('.modal-stop');
  stopElement.addEventListener('click', stopPropagation);
  const closebtn = modal.querySelector('.close-btn');
  closebtn.addEventListener('click', closeModal);
  displayAjouterModal();



  if (modalAjout) {
    modal.style.display = "flex";
    backBtn = document.getElementById('back-btn');
    backBtn.style.display = "flex";
    modalBtnValider = document.getElementById('modal-btn-valider');
    modalBtnValider.style.display = "block";
    modalBtnValider.classList.add('valider');
    modalBtnValider.addEventListener('click', sendimage);
    modalBtnEnvoyer = document.getElementById('modal-btn-envoyer');
    modalBtnEnvoyer.style.display = "none";
    clearModalContent();
    modal.addEventListener("click", closeModal);
  }

};

/** permet de creer la modal pour voir voir la gallery et supprimer des travaux  */
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
    clearAjoutImageModal();
    modalBtnValider = document.getElementById('modal-btn-valider');
    modalBtnValider.style.display = "none";
    modalBtnEnvoyer = document.getElementById('modal-btn-envoyer');
    modalBtnEnvoyer.style.display = "block";
    const modalBtn = document.querySelector('.modal-btn');
    modalBtn.justifyContent = "end";
    modal.addEventListener("click", closeModal);
  }
};
/** Fonction limiter la propagation du clique */
const stopPropagation = function (event) {
  event.stopPropagation()
};

/** supprime le contenu de open modal*/
const clearModalContent = () => {
  const modalthumbnail = document.querySelector("#modal  .thumbnail");
  if (modalthumbnail) {
    modalthumbnail.remove();
  }
};
/** supprime le contenu de ajout photo dans modal*/
const clearAjoutImageModal = () => {
  const modalAjouter = document.querySelector(".Ajouter-modal");
  if (modalAjouter) {
    modalAjouter.remove();
  }
};

/** fermeture de la modal*/
const closeModal = function (event) {
  event.preventDefault();
  clearModalContent();
  clearAjoutImageModal();
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
document.addEventListener('DOMContentLoaded', function () {
  // Sélectionner le formulaire
  const envoyerImage = document.getElementById('mainConteneur');

  // Ajouter un écouteur d'événements sur la soumission du formulaire
  envoyerImage.addEventListener('submit', function (event) {
    event.preventDefault();

    // Récupérer les valeurs des champs du formulaire
    const image = document.getElementById('imagePreviewContainer').value;
    const titre = document.getElementById('titreNouvelleImage').value;
    const categorie = document.getElementById('selectCategorie').value;

    // Créer un objet avec les données à envoyer
    const postData = {
      title: titre,
      imageUrl: image,
      categoryId: categorie,
    };

    // Configuration de la requête
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    };

    // Effectuer la requête
    fetch("http://localhost:5678/api/works", requestOptions)
      .then((response) => {
        if (response.ok) {
          //console.log(response.json());
          return response.json();
        } else {
          console.log("la requête n'a pas abouti");
          const msg = document.getElementById("alert");
          msg.style.display = "block";
          throw new Error("Identifiants incorrects");
        }
      })
      .then((data) => {
        // données renvoyées par l'API
        console.log("Information sur la recuperation du TOKEN :", data);

        const token = data.token;
        console.log(token);
        localStorage.setItem("token", token.toString());


        window.location.href = "./index.html";
      })
      .catch((error) => {
        // Gérer les erreurs
        console.error("Erreur de requête vers l'API:", error);
        //alert("Identifiants incorrects. Veuillez réessayer.");
      });
  });
})
// Ajoute la photo dans la modal ajout photo;
const Imageuser = () => {
  const imageInput = document.getElementById('btnAjouterImage');
  const imagePreviewContainer = document.querySelector('.image-preview-container');

  imageInput.addEventListener('change', () => {
    const files = imageInput.files;

    if (files && files.length > 0) {
      const file = files[0];

      if (file.size > 4 * 1024 * 1024) {
        MessageErreur = document.getElementById('MessageErreur');
        MessageErreur.textContent = "Vous devez reduire la taille à 4mo max";
        MessageErreur.style.display = "flex";
        imageInput.value = '';
      } else {
        const reader = new FileReader();
        reader.onload = function (e) {
          const imagePreview = document.createElement('img');

          imagePreview.src = e.target.result;
          imagePreview.classList.add('image-preview');
          imagePreview.id = 'imagePreview';
          imageUrl = e.target.result;
          checkInputs();

          const ensembleImage = document.getElementById('ensembleImage');
          if (ensembleImage) {
            ensembleImage.innerHTML = '';
          }

          ensembleImage.appendChild(imagePreviewContainer);
          imagePreviewContainer.appendChild(imagePreview);


        };
        reader.readAsDataURL(file);



      }
    }
  });
};

// gestion de l'envoi d'image vers l'api

const sendimage = async () => {
  const token = localStorage.getItem("token");
  const titre = document.getElementById('titreNouvelleImage').value;
  const categorie = document.getElementById('selectCategorie').value;


  if (!imageUrl) {
    MessageErreur = document.getElementById('MessageErreur');
    MessageErreur.textContent = "Veuillez sélectionner une image.";
    MessageErreur.style.display = "flex";
    return; // Arrêter la fonction si le titre ou l'image est manquant
  }
  if (!titre) {
    MessageErreur = document.getElementById('MessageErreur');
    MessageErreur.textContent = "Veuillez ajouter un titre.";
    MessageErreur.style.display = "flex";
    return;
  }
  if (!categorie) {
    MessageErreur = document.getElementById('MessageErreur');
    MessageErreur.textContent = "Veuillez ajouter une catégorie.";
    MessageErreur.style.display = "flex";
    return;
  }


  const imageFile = await fetch(imageUrl)
    .then(response => response.blob())
    .then(blob => new File([blob], 'image.jpg', { type: 'image/jpeg' }));
  console.log(imageFile);
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('title', titre);
  formData.append('category', categorie);
  try {
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      console.log('Nouveau projet envoyé avec succès!');
      window.location.href = "./index.html";
    } else {
      console.error('Erreur lors de l\'envoi du nouveau projet:', response.statusText);
    }
  } catch (error) {
    console.error('Une erreur s\'est produite: ', error);
  }
};


// verification des elements indiqué dans le formulaire modal
function checkInputs() {
  const imageInput = document.getElementById('btnAjouterImage').value;
  console.log(imageInput);
  const titreInput = document.getElementById('titreNouvelleImage').value;
  console.log(titreInput);
  const categorieInput = document.getElementById('selectCategorie').value;
  console.log(categorieInput);
  const validerBtn = document.getElementById("modal-btn-valider");

  // Vérifier si les champs sont remplis
  if (imageInput && titreInput && categorieInput) {
    // Activer le bouton "submit"

    validerBtn.classList.remove('valider');
    validerBtn.classList.add('modal-btn-envoyer');
    console.log('le bouton envoyer est Activé');
  } else {
    // Désactiver le bouton "submit"

    console.log('le bouton envoyer est desactivé');
    validerBtn.classList.remove('modal-btn-envoyer');
    validerBtn.classList.add('valider');
  }
};
