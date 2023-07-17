const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const morgan = require('morgan');
const mongodb = require('./database/db.js');
const port = 8080;
const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
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


// app.get('/', (req, res) => {
//     res.status(200).send("Hi i am here!!");
// })

app.use('/api', require('./routes/auth.js'))

app.listen(port, () => {
    console.log(`App is listening to port${port}`);
})
mongodb();
