document.addEventListener('DOMContentLoaded', function () {
  // Sélectionner le formulaire
  const loginForm = document.getElementById('login-form');

  // Ajouter un écouteur d'événements sur la soumission du formulaire
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Récupérer les valeurs des champs du formulaire
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Créer un objet avec les données à envoyer
    const postData = {
      email: email,
      password: password
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
    fetch('http://localhost:5678/api/users/login', requestOptions)
      .then(response => response.json())
      .then(data => {
        // données renvoyées par l'API
        console.log('Information sur la recuperation du TOKEN :', data);

    
      const token = data.token;
      console.log(token)
      localStorage.setItem('monToken', token);
       

        // Vous pouvez également rediriger l'utilisateur vers une autre page après l'authentification
        // window.location.href = './nouvelle-page.html';
      })
      .catch(error => {
        // Gérer les erreurs
        console.error('Erreur de requête vers l\'API:', error);
      });
  });
});

