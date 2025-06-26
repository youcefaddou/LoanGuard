const app = require('./app');
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Le Backend fonctionne sur http://localhost:${PORT}`);
});