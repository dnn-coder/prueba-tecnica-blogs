const { app } = require('./app');
const { db } = require('./utils/database.util');

const { initModels } = require('./models/initModels');

db.authenticate()
  .then(() => console.log('Database Authenticated...'))
  .catch(err => console.log(err));

//establecer las relacions mediante los modelos desde el archivo inirModels
initModels();

db.sync()
  .then(() => console.log('Database Synced...'))
  .catch(err => console.log(err));

app.listen(4000, () => {
  console.log('Express app running on port 4000... ');
});
