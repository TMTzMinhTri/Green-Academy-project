const express = require('express')
const bodyParser = require('body-parser');
var cors = require('cors');

const app = express()
const port = 5000
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const accountRoute = require('./apis/routes/account.route')

app.use('/api/account',cors() ,accountRoute);

app.listen(port, () => console.log(`Listening on port ${port}!`));
