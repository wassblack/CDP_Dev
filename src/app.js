const express = require('express');
const app = express();
const env = require('dotenv');
const mongoose = require('mongoose');
const expressLay = require('express-ejs-layouts');
env.config();

app.use(expressLay);
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(3000, () => console.log('server started'));
}

);


