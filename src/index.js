const express = require('express');
const path = require('path');
const exhbs = require('express-handlebars');
const mor = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const bodyParser = require('body-parser');


//Inicializanciones
const app = express();
require('./database');
require('./config/passport');

//Settings
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exhbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));

app.set('view engine', '.hbs');

//MiddleWares
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(mor('_method'));
app.use(session({
    secret: 'wolfskull2019!',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global Variables
app.use((req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//Static Files
app.use(express.static(path.join(__dirname,'public')));

//Server Listening
app.listen(app.get('port'), () => {
    console.log('server on port: ', app.get('port'));
});