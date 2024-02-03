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