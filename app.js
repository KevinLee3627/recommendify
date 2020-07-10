let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let sassMiddleware = require('node-sass-middleware');


let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(sassMiddleware({
//   src: path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   indentedSyntax: true, // true = .sass and false = .scss
//   sourceMap: true
// }));
app.use(express.static(path.join(__dirname, 'public')));

/*------ ROUTERS ------*/

let indexRouter = require('./routes/index');
let apiRouter = require('./routes/api');
let testRouter = require('./routes/test')
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/test', testRouter);

/*---------------------*/

/*-----SPOTIFY API-----*/

const axios = require('axios')
const spotify_url = 'https://accounts.spotify.com/api/token'
const to_encode = `${process.env.clientID}:${process.env.clientSecret}`
const encoded_auth = Buffer.from(to_encode).toString('base64')
function getToken() {
    axios({
        method: 'post',
        url: spotify_url,
        headers: {
            'Authorization': `Basic ${encoded_auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {'grant_type': 'client_credentials'}
    }).then( (res) => {
        console.log(res.data);
        app.locals.spotify_token = res.data.access_token
				console.log(app.locals);
    }).catch( (err) => {
        console.log(err);
    })
}
getToken();
setInterval( () => {
    getToken();
}, 1000*60*60)

/*---------------------*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/* MONGODB */
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost/recommendr';
// const autoIncrement = require('mongoose-auto-increment');
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).catch(err => console.log(err));
// console.log(mongoose.connection.readyState);
// autoIncrement.initialize(mongoose)

module.exports = app;
