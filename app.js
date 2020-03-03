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
        db.all("SELECT * from products", function(err, results) {
            if (err != null) {
                console.log(`Something went wrong: ${err.toString()}`);
            }
          res.render('home', {
              pageTitle: 'Products',
              products: results
          })
            
        });
      });

});

app.post('/addproduct', (req,res) => {
    const { newproduct, newgroup,productDescribe } = req.body;
    db.serialize(function () {
        db.run("INSERT INTO products(name,category,describe) VALUES (?, ?, ?)", [newproduct,newgroup,productDescribe]);

        db.get(`SELECT id FROM products WHERE name = "${newproduct}" AND category = "${newgroup}"`, (err, result) => {
            if (err != null) {
                console.error(err.toString())
            }

            db.run(`INSERT INTO inventory(product_id, stock) VALUES (${result.id}, 0)`, (err) => {
                if (err != null) {
                    console.error(err.toString())
                }
            })
            res.redirect('/');
        })
    });
});

app.get('/inventory',(req,res) => {
    db.serialize(function () {
        db.all("SELECT products.id, products.name, products.category, inventory.stock FROM products JOIN inventory ON products.id = inventory.product_id", function (err, results) {
            if (err != null) {
                console.error(err.toString())
            }
            res.render('inventory',{pageTitle: 'Inventory', invent: results});
        });
    });
});

app.post('/editinv',(req,res) => {
    const {newpieces,id} = req.body;
    db.serialize(function() {
        db.run(`UPDATE inventory SET stock = "${newpieces}" WHERE product_id = "${id}"`);
    });

    res.redirect('/inventory');
});

app.post('/editproduct',(req,res) => {
    const {newproduct,newgroup,id,productDescribe} = req.body;
    db.serialize(function() {
        db.run(`UPDATE products SET name = "${newproduct}", category = "${newgroup}", describe = "${productDescribe}" WHERE products.id = "${id}"`);
    });
    res.redirect('/');
});

app.post('/deleteproduct',(req,res) => {
    const {id} = req.body;
    db.serialize(function() {
        db.run(`DELETE FROM products WHERE products.id="${id}"`);
        db.run(`DELETE FROM inventory WHERE product_id="${id}"`);
    })
    res.redirect('/');
});

app.get('/groups',(req,res) => {
    db.serialize(function() {
        db.all("SELECT name FROM inventory_groups", function(err, results) {
            if (err != null) {
                console.log(`Something went wrong: ${err.toString()}`);
            }
          res.render('groups', {
              pageTitle: 'Groups',
              groupElements: results
          })
            
        });
      });
});

app.post('/addgroup',(req,res) => {
    const { newgroup } = req.body;
    console.log(newgroup);
    db.serialize(function () {
        db.run("INSERT INTO inventory_groups(name) VALUES (?)", [newgroup]);
        res.redirect('groups');
    });
})

app.listen(port, () => {
    console.log(`This app listen on port: ${port}`);
});
