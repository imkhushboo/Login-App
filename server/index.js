const express = require('express');
const path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
const morgan = require('morgan');
const mongodb = require('./database/db.js');
require('dotenv').config();
console.log(process.env);
const PORT = process.env.PORT || 8080;
const app = express();
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cors());

app.use(cors(corsOptions));
app.use(morgan('tiny'));
app.disable('x-powered-by');




app.use('/api', require('./routes/auth.js'));

app.listen(PORT, () => {
    console.log(`App is listening to port ${PORT}`);
})
mongodb();
