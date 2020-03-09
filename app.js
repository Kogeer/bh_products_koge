const express = require('express');
const app = express();
const port = 5000;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventory.db');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const path = require('path');
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    db.serialize(function () {
        db.all("SELECT products.id AS id, describe, inventory_groups.name AS gn, products.name AS pn FROM products LEFT JOIN inventory_groups ON products.cat_id = inventory_groups.id;", function (err, results) {
            if (err != null) {
                console.log(`Something went wrong: ${err.toString()}`);
            }
            db.all("SELECT name FROM inventory_groups;", function (err, groups) {
                if (err != null) {
                    console.log(`Something went wrong: ${err.toString()}`);
                }
                res.render('home', {
                    pageTitle: 'Products',
                    products: results,
                    groups: groups
                })
            })
        });
    });
});

app.post('/addproduct', (req, res) => {
    const { newproduct, newgroup, productDescribe } = req.body;
    db.serialize(function () {
        db.get(`SELECT id FROM inventory_groups WHERE name = "${newgroup}";`, (err, result_group) => {
            if (err != null) {
                console.log(`Something went wrong ${err.toString()}`)
            }
            db.run("INSERT INTO products(name,cat_id,describe) VALUES (?,?,?)", [newproduct, result_group.id, productDescribe]);
            db.get(`SELECT id FROM products WHERE name = "${newproduct}"`, (err, result_id) => {
                db.run("INSERT INTO inventory(product_id, stock) VALUES (?,0)", [result_id.id]);
            })
        })
        res.redirect('/');
    });
});

app.get('/inventory', (req, res) => {
    db.serialize(function () {
        db.all("SELECT products.id, products.name, products.cat_id, inventory.stock FROM products JOIN inventory ON products.id = inventory.product_id", function (err, results) {
            if (err != null) {
                console.error(err.toString())
            }
            res.render('inventory', { pageTitle: 'Inventory', invent: results });
        });
    });
});

app.post('/editinv', (req, res) => {
    const { newpieces, id } = req.body;
    db.serialize(function () {
        db.run(`UPDATE inventory SET stock = "${newpieces}" WHERE product_id = "${id}"`);
    });

    res.redirect('/inventory');
});

app.post('/editproduct', (req, res) => {
    const { newproduct, newgroup, id, productDescribe } = req.body;
    db.serialize(function () {
        db.get(`SELECT id FROM inventory_groups WHERE name = "${newgroup}";`, (err, groupd_id) => {
            db.run(`UPDATE products SET name = "${newproduct}", cat_id = "${groupd_id.id}", describe = "${productDescribe}" WHERE products.id = "${id}"`);
        })
    });
    res.redirect('/');
});

app.post('/deleteproduct', (req, res) => {
    const { id } = req.body;
    db.serialize(function () {
        db.run(`DELETE FROM products WHERE products.id="${id}"`);
        db.run(`DELETE FROM inventory WHERE product_id="${id}"`);
    })
    res.redirect('/');
});

app.get('/groups', (req, res) => {
    db.serialize(function () {
        db.all("SELECT name, id FROM inventory_groups", function (err, results) {
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

app.post('/addgroup', (req, res) => {
    const { newgroup } = req.body;
    console.log(newgroup);
    db.serialize(function () {
        db.run("INSERT INTO inventory_groups(name) VALUES (?)", [newgroup]);
        res.redirect('groups');
    });
});

app.post('/editgroup', (req, res) => {
    const { editGroup, editId } = req.body;
    db.run(`UPDATE inventory_groups SET name = "${editGroup}" WHERE inventory_groups.id="${editId}"`, (err) => {
        if (err != null) {
            console.log(`Something went wrong ${err.toString()}`);
        }
    })
    res.redirect('/groups');
});

app.post('/deletegroup', (req,res) => {
    const { deleteId } = req.body;
    console.log(deleteId);
    db.run(`DELETE FROM inventory_groups WHERE id="${deleteId}";`);
    res.redirect('/groups');
})

app.listen(port, () => {
    console.log(`This app listen on port: ${port}`);
});
