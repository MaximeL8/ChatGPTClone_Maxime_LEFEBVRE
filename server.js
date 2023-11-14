import app from './src/app.cjs';

const port = 3000;
const host = 'localhost';
//const host = '192.168.1.15';
//const host = '10.8.16.240';

app.listen(port, host, () => {
  console.log(`Serveur en cours d'exécution sur http://${host}:${port}`);
});
