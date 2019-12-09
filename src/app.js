const express = require('express');
const app = express();

const env = require('dotenv');
const mongoose = require('mongoose');

const expressLay = require('express-ejs-layouts');
const session = require('express-session');

const flash = require('connect-flash');
const passport = require('passport');
const PORT = process.env.PORT || 3000;

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express');
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Scrum it API',
            description: 'Scrum it API',
            constact: {
                name : 'Grp2-eq5'
            },
            servers: ["http://localhost:3000"]
      }
    },
    apis:['./routes/*.js']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs',swaggerui.serve, swaggerui.setup(swaggerDocs));

require('./config/passport-config')(passport);
env.config();
app.use(flash());
app.use(expressLay);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

//global messages for use if redirect
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
});

//Routes
app.use('/', require('./routes/index'), require('./routes/createProject'), require('./routes/project'), require('./routes/userStory'), 
             require('./routes/sprint'));
app.use('/users', require('./routes/users'));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(PORT, () => console.log('Server started on port 3000'));
});

module.exports = app;
