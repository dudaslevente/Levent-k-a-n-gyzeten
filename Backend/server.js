require('dotenv').config();
const express = require('express');
var mysql = require('mysql');
const uuid = require('uuid');
var cors = require('cors');
var CryptoJS = require("crypto-js");
var moment = require('moment');

const app = express();
const port = process.env.PORT;
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

var pool  = mysql.createPool({
  connectionLimit : process.env.CONNECTIONLIMIT,
  host            : process.env.DBHOST,
  user            : process.env.DBUSER,
  password        : process.env.DBPASS,
  database        : process.env.DBNAME
});


// get API version
app.get('/', (req, res) => {
    res.send(`API version : ${process.env.VERSION}`);
});
  

// user regisztráció 
app.post('/reg', (req, res) => {

    // kötelező adatok ellenőrzése
    if (!req.body.name || !req.body.email || !req.body.passwd || !req.body.confirm ){
       res.status(203).send('Nem adtál meg minden kötelező adatot!');
       return;
    }
  
    // jelszavak ellenőrzése
    if (req.body.passwd != req.body.confirm){
      res.status(203).send('A megadott jelszavak nem egyeznek!');
      return;
    }
    
    // jelszó min kritériumoknak megfelelés
    if (!req.body.passwd.match(passwdRegExp)){
      res.status(203).send('A jelszó nem elég biztonságos!');
      return;
    }
  
    // email cím ellenőrzés
    pool.query(`SELECT * FROM users WHERE email='${req.body.email}'`, (err, results) => {
       
      if (err){
        res.status(500).send('Hiba történt az adatbázis elérése közben!');
        return;
       }
      
      // ha van már ilyen email cím
      if (results.length != 0){
        res.status(203).send('Ez az e-mail cím már regisztrálva van!');
        return;
       }
      
      // új felhasználó felvétele
      pool.query(`INSERT INTO users VALUES('${uuid.v4()}', '${req.body.name}', '${req.body.email}', SHA1('${req.body.passwd}'), 'user')`, (err, results)=>{
        if (err){
          res.status(500).send('Hiba történt az adatbázis művelet közben!');
          return;
         }
         res.status(202).send('Sikeres regisztráció!');
         return;
      });
      return;
    });
   
});
  
  // user belépés
app.post('/login', (req, res) => {
  
    //console.log(req.body);
    if (!req.body.email || !req.body.passwd) {
      res.status(203).send('Hiányzó adatok!');
      return;
    }
  
    pool.query(`SELECT ID, name, email, role FROM users WHERE email ='${req.body.email}' AND passwd='${CryptoJS.SHA1(req.body.passwd)}'`, (err, results) =>{
      if (err){
        res.status(500).send('Hiba történt az adatbázis lekérés közben!');
        return;
      }
      if (results.length == 0){
        res.status(203).send('Hibás belépési adatok!');
        return;
      }
      res.status(202).send(results);
      return;
    });
  
});
 
