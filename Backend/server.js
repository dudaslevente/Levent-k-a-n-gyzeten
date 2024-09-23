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
    if (!req.body.name || !req.body.email || !req.body.passwd || !req.body.confirm || !req.body.phone ){
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
      console.log(`INSERT INTO users VALUES('${uuid.v4()}', '${req.body.name}', '${req.body.email}', '${req.body.phone}', 'user', 'engedélyezet', SHA1('${req.body.passwd}'))`);
      // új felhasználó felvétele
      pool.query(`INSERT INTO users VALUES('${uuid.v4()}', '${req.body.name}', '${req.body.email}', '${req.body.phone}', 'user', 'engedélyezet', SHA1('${req.body.passwd}'))`, (err, results)=>{
        if (err){
          res.status(500).send('Hiba!' + err);
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
  
    pool.query(`SELECT ID, name, email, phone, role, status FROM users WHERE email ='${req.body.email}' AND passwd='${CryptoJS.SHA1(req.body.passwd)}'`, (err, results) =>{
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

// bejelentkezett felhasználó adatainak lekérése
app.get('/me/:id', logincheck, (req, res) => {
   if (!req.params.id) {
     res.status(203).send('Hiányzó azonosító!');
     return;
   }
 
   pool.query(`SELECT name, email, role FROM users WHERE ID='${req.params.id}'`, (err, results) =>{ 
     if (err){
       res.status(500).send('Hiba történt az adatbázis lekérés közben!');
       return;
     }
 
     if (results.length == 0){
       res.status(203).send('Hibás azonosító!');
       return;
     }
 
     res.status(202).send(results);
     return;
   });
});

// felhasználó módosítása
app.patch('/users/:id', logincheck, (req, res) => {
  
  if (!req.params.id) {
    res.status(203).send('Hiányzó azonosító!');
    return;
  }

  if (!req.body.name || !req.body.email || !req.body.role) {
    res.status(203).send('Hiányzó adatok!');
    return;
  }

  //TODO: ne módosíthassa már meglévő email címre az email címét

  pool.query(`UPDATE users SET name='${req.body.name}', email='${req.body.email}', role='${req.body.role}' WHERE ID='${req.params.id}'`, (err, results) => {
    if (err){
      res.status(500).send('Hiba történt az adatbázis lekérés közben!');
      return;
    }

    if (results.affectedRows == 0){
      res.status(203).send('Hibás azonosító!');
      return;
    }

    res.status(200).send('Felhasználó adatok módosítva!');
    return;
  });
});

// jelszó módosítás
app.patch('/passmod/:id', logincheck, (req, res) => {
  
  if (!req.params.id) {
    res.status(203).send('Hiányzó azonosító!');
    return;
  }

  if (!req.body.oldpass || !req.body.newpass || !req.body.confirm) {
    res.status(203).send('Hiányzó adatok!');
    return;
  }

   // jelszavak ellenőrzése
   if (req.body.newpass != req.body.confirm){
    res.status(203).send('A megadott jelszavak nem egyeznek!');
    return;
  }
  
  // jelszó min kritériumoknak megfelelés
  if (!req.body.newpass.match(passwdRegExp)){
    res.status(203).send('A jelszó nem elég biztonságos!');
    return;
  }

  // megnézzük, hogy jó-e a megadott jelenlegi jelszó
  pool.query(`SELECT passwd FROM users WHERE ID='${req.params.id}'`, (err, results) => {
    if (err){
      res.status(500).send('Hiba történt az adatbázis lekérés közben!');
      return;
    }

    if (results.length == 0){
      res.status(203).send('Hibás azonosító!');
      return;
    }

    if (results[0].passwd != CryptoJS.SHA1(req.body.oldpass)){
      res.status(203).send('A jelenlegi jelszó nem megfelelő!');
      return;
    }

    pool.query(`UPDATE users SET passwd=SHA1('${req.body.newpass}') WHERE ID='${req.params.id}'`, (err, results) => {
      if (err){
        res.status(500).send('Hiba történt az adatbázis lekérés közben!');
        return;
      }
  
      if (results.affectedRows == 0){
        res.status(203).send('Hibás azonosító!');
        return;
      }
  
      res.status(200).send('A jelszó módosítva!');
      return;
    });

  });

});

// felhasználók listája (CSAK ADMIN)
app.get('/users', admincheck, (req, res) => {

  //TODO: csak admin joggal lehet - később

  pool.query(`SELECT ID, name, email, role FROM users`, (err, results) => {
    if (err){
      res.status(500).send('Hiba történt az adatbázis lekérés közben!');
      return;
    }
    res.status(200).send(results);
    return;
  });
});

// felhasználó adatainak lekérése id alapján (CSAK ADMIN)
app.get('/users/:id', logincheck, (req, res) => {

  if (!req.params.id) {
     res.status(203).send('Hiányzó azonosító!');
     return;
   }
 
   pool.query(`SELECT name, email, role FROM users WHERE ID='${req.params.id}'`, (err, results) =>{ 
     if (err){
       res.status(500).send('Hiba történt az adatbázis lekérés közben!');
       return;
     }
 
     if (results.length == 0){
       res.status(203).send('Hibás azonosító!');
       return;
     }
 
     res.status(202).send(results);
     return;
 
   });
 });
 
// felhasználó törlése id alapján (CSAK ADMIN)
app.delete('/users/:id', logincheck, (req, res) => {
  
  if (!req.params.id) {
    res.status(203).send('Hiányzó azonosító!');
    return;
  }

  pool.query(`DELETE FROM users WHERE ID='${req.params.id}'`, (err, results) => {
    
    if (err){
      res.status(500).send('Hiba történt az adatbázis lekérés közben!');
      return;
    }
    
    if (results.affectedRows == 0){
      res.status(203).send('Hibás azonosító!');
      return;
    }

    res.status(200).send('Felhasználó törölve!');
    return;

  });
});


function logincheck(req, res, next){
  let token = req.header('Authorization');
  
  if (!token){
    res.status(400).send('Jelentkezz be!');
    return;
  }

  pool.query(`SELECT * FROM users WHERE ID='${token}'`, (err, results) => {
    if (results.length == 0){
      res.status(400).send('Hibás authentikáció!');
      return;
    } 

    next();
  });

  return;
}


// jogosultság ellenőrzése

function admincheck(req, res, next){
  let token = req.header('Authorization');
  
  if (!token){
    res.status(400).send('Jelentkezz be!');
    return;
  }

  pool.query(`SELECT role FROM users WHERE ID='${token}'`, (err, results) => {
    if (results.length == 0){
      res.status(400).send('Hibás authentikáció!');
      return;
    } 
    if (results[0].role != 'admin'){
      res.status(400).send('Nincs jogosultságod!');
      return;
    }
    next();
  });

  return;
}


/* ÁT KELL IRNI RECEPTER
 
// összes felhasználó lépésadatainak lekérdezése (CSAK ADMIN)
app.get('/steps', logincheck, (req, res) => {
  
  pool.query(`SELECT * FROM stepdatas`, (err, results) => {
    if (err){
      res.status(500).send('Hiba történt az adatbázis lekérés közben!');
      return;
    }

    res.status(200).send(results);
    return;

  });

});
/* ÁT KELL IRNI RECEPTER
// felhasználó lépésadatainak lekérdezése
app.get('/steps/:userID', logincheck, (req, res) => {
  if (!req.params.userID) {
    res.status(203).send('Hiányzó azonosító!');
    return;
  }

  pool.query(`SELECT * FROM stepdatas WHERE userID='${req.params.userID}'`, (err, results) => {
    if (err){
      res.status(500).send('Hiba történt az adatbázis lekérés közben!');
      return;
    }

    res.status(200).send(results);
    return;

  });

});

// felhasználó lépésadatainak felvitele
app.post('/steps/:userID', logincheck, (req, res) => {

  if (!req.params.userID) {
    res.status(203).send('Hiányzó azonosító!');
    return;
  }

  if (!req.body.date || !req.body.stepcount) {
    res.status(203).send('Hiányzó adatok!');
    return;
  }

  let today = moment().format('YYYY-MM-DD');
  let date = moment(req.body.date).format('YYYY-MM-DD');

  // string-ként összehasonlítjuk a két dátumot
  if (date.localeCompare(today) > 0){
    res.status(203).send('A dátum nem lehet jövőbeli!');
    return;
  }

  pool.query(`SELECT ID FROM stepdatas WHERE userID='${req.params.userID}' AND date='${date}'`, (err ,results) => {
    if (err){
      res.status(500).send('Hiba történt az adatbázis művelet közben!');
      return;
    }

    if (results.length != 0){
      // update
      pool.query(`UPDATE stepdatas SET count=count+${req.body.stepcount} WHERE ID='${results[0].ID}'`, (err) => {
        if (err){
          res.status(500).send('Hiba történt az adatbázis művelet közben!');
          return;
        }
    
        res.status(200).send('A lépésadat hozzáadva a meglévőhöz!');
        return;
      });
    }

    // insert
    if (results.length == 0){
    pool.query(`INSERT INTO stepdatas VALUES('${uuid.v4()}', '${req.params.userID}', '${date}', ${req.body.stepcount})`, (err) => {
      if (err){
        res.status(500).send('Hiba történt az adatbázis művelet közben!');
        return;
      }
  
      res.status(200).send('A lépésadat felvéve!');
      return;
    });
    }
  });

});
*/





app.listen(port, () => {
  //console.log(process.env) ;
  console.log(`Server listening on port ${port}...`);
});

// MIDDLEWARE functions
