const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Welcome'));

app.post('/update', (req, res) =>{
    const Controller = require('./handlers/controller');
    new Controller().updateRemoteApi(res);
});

app.put('/api/:resource', require('./handlers/resource'));

app.listen(process.env.PORT, () => {
  console.log(`Server started`)
})