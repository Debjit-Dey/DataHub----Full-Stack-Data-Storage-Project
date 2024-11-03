const express = require('express');
const dotenv = require('dotenv');
// dotenv.config({path: './.env'});
dotenv.config()
const app = express();
const cookieParser = require('cookie-parser');
const userRoute = require('./routers/user.router.js');
const homeRoute = require('./routers/index.router.js');

const DBConnection= require("./config/db")
// console.log(DBConnection)
DBConnection();





app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// app.get('/', (req, res) => {
//     // res.send('Hello World!');
//     res.render('index');
// });

app.use("/", userRoute);
app.use("/home", homeRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server is listening at ${process.env.PORT}`);
});