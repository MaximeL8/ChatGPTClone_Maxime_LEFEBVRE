const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { OpenAI } = require('openai');

const app = express();

// Middleware Body-parser pour traiter les données JSON et les formulaires HTML
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('src')); // Remplacez 'public' par le nom de votre dossier contenant les fichiers statiques (comme les fichiers CSS).

// Configuration du moteur de modèle EJS
app.set('view engine', 'ejs');

// Configuration du chemin du répertoire des vues
const ViewsPath = path.join(__dirname, 'Views');
console.log(ViewsPath);
app.set('views', ViewsPath);

// Declare formData outside the route callback function
let formData;

// Route pour afficher le formulaire
app.get('/', (req, res) => {
  res.render('index');
});

// Route pour traiter le formulaire
app.post('/traitement', (req, res) => {
    const firstname = req.body.firstname;
    const name = req.body.name;
    const requestText = req.body.request;
    const email = req.body.email;

    // Récupérez la clé d'API à partir des variables d'environnement
    const apiKey = process.env.OPENAI_API_KEY;

    // Vérifiez si la clé d'API est présente
    if (!apiKey) {
      console.error("La clé d'API OpenAI n'est pas définie dans les variables d'environnement.");
      return res.status(500).send("Internal Server Error");
    }

    const openai = new OpenAI({ key: apiKey });

    openai.chat.completions.create({
      model : 'gpt-3.5-turbo',
      messages : [ 
        {'role': 'user', 'content': requestText}
      ],
    })
    .then(response => {
      // Assign the value to formData
      console.log(response)
      console.log(response.choices[0].message)
      formData = {
        firstname: firstname,
        name: name,
        email: email,
        request: requestText,
        answer: response.choices[0].message.content
      };
      // Redirect the user or send a confirmation message
      res.send(response.choices[0].message.content);
      
      // Continue with file operations here
      updateJsonFile();
    })
    .catch(error => {
      console.error(error);
      return res.status(500).send('Error generating OpenAI completion');
    });
});

// Function to update the JSON file
function updateJsonFile() {
  // Read the existing JSON file
  const filePath = path.join(__dirname, 'Data', 'data.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading JSON file');
    }

    let jsonData;

    try {
      // Parse the existing JSON data
      jsonData = JSON.parse(data);
    } catch (parseError) {
      // If the file is empty or corrupted, initialize it with an empty array
      jsonData = [];
    }

    // Add the new form data to the array
    jsonData.push(formData);

    // Write the updated JSON data back to the file
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error writing to JSON file');
      }

      // Additional logic after writing to the file, if needed
    });
  });
}

module.exports = app; // Exporte l'application Express configurée
