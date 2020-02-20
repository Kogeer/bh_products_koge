const express = require('express');
const app = express();
const port = 5000;
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('inventory.db');

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const path = require('path');
app.use(express.static(path.join(__dirname, '/public')));

// const products = [
//     {
//         ID: 1,
//         Megnevezés: 'Processzor',
//         Csoport: 'Számítástechnika'
//     },
//     {
//         ID: 2,
//         Megnevezés: 'Processzor',
//         Csoport: 'Számítástechnika'
//     },
//     {
//         ID: 3,
//         Megnevezés: 'Processzor',
//         Csoport: 'Számítástechnika'
//     },
//     {
//         ID: 4,
//         Megnevezés: 'Processzor',
//         Csoport: 'Számítástechnika'
//     },
//     {
//         ID: 5,
//         Megnevezés: 'Processzor',
//         Csoport: 'Számítástechnika'
//     },
//     {
//         ID: 6,
//         Megnevezés: 'Processzor',
//         Csoport: 'Számítástechnika'
//     },
//     {
//         ID: 7,
//         Megnevezés: 'Processzor',
//         Csoport: 'Számítástechnika'
//     }
// ]

// app.get('/',(req,res) => {
//     res.render('home',{products:products, pageTitle:'Products'});
// })

app.get('/', (req, res) => {
    db.serialize(function() {
        db.all("SELECT rowid, * from products", function(err, results) {
            if (err != null) {
                // hibakezelés
            }
          res.render('home', {
              pageTitle: 'Products',
              products: results
          })
            
        });
      });

})

app.listen(port, () => {
    console.log(`This app listen on port: ${port}`);
});