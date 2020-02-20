const express = require('express');
const app = express();
const port = 5000;
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('inventory.db');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const path = require('path');
app.use(express.static(path.join(__dirname, '/public')));

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

});

app.post('/addproduct', (req,res) => {
    const { newproduct, newgroup } = req.body;
    console.log(newproduct, newgroup);
    db.serialize(function () {
        db.run("INSERT INTO products VALUES (?, ?)", [newproduct,newgroup]);
    });

    res.redirect('/')

})

app.listen(port, () => {
    console.log(`This app listen on port: ${port}`);
});