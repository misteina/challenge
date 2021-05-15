const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => res.send('Welcome'));

app.get('/update', (req, res) =>{
    const Controller = require('./handlers/controller');
    new Controller().updateRemoteApi(res);
});

app.put('/api/:resource', require('./handlers/resource'));

app.listen(process.env.PORT, () => {
  console.log(`Server started`)
})