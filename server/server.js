const express = require('express');
const cors = require('cors');
const path = require('path');
const router = express.Router();

const middleware = require('./middleware')

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

router.post('/generateToken', middleware.generateToken, (req, res) => {
    res.status(200).send(res.locals.token)
})

app.listen(PORT, () => {
    console.log(`Servers listening on ${PORT}`);
})

module.exports = app;
