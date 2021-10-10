const express = require('express')
const ch = require('child_process')
const app = express();
const port = 3000
const loginController = require('./controllers/LoginController.js')
const dashboardController = require('./controllers/DashboardController.js')
const productsController = require('./controllers/ProductsController.js')
const transactionsController = require('./controllers/TransactionsController.js')
const registerController = require('./controllers/RegisterController.js')

const mysql = require('mysql');

const con = mysql.createConnection({
  host: "127.0.0.1",
  port:3306,
  user: "root",
  password: "Ambikannan@27",
  database: "shop"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


app.set('view engine','ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

loginController(app,con)
dashboardController(app,con)
productsController(app,con)
transactionsController(app,con)
registerController(app,con)


app.listen(port,() => {

  console.log('Started listening to port : ' + port);
});

ch.exec('start http://localhost:3000',(err,stdout,stderr) => {})