// require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
// initialize our express app
const app = express();

app.use(cors({credentials: true, origin: true}))
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const user = require('./routes/user.routes'); // Imports routes

//body parser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.set('secretKey', 'nodeRestApi'); // jwt secret token


app.use('/user', user);

//DATABASE CONNECTION

let dev_db_url = 'mongodb://anupnair:instagram123@ds237357.mlab.com:37357/instagram';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



let port = 4000;
app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});