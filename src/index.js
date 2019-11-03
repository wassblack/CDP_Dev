const express = require('express');
const app = express();
const env = require('dotenv');
const mongoose = require('mongoose');

env.config();
app.use('/', (req, res) => {
    res.send(process.env.MONGO_URI);
});
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(3000, () => console.log('server started'));
}

);


