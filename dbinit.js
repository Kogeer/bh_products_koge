var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('inventory.db');

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS inventory_groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(40))");

    db.run("INSERT INTO inventory_groups(id,name) VALUES (1, 'Számítástechnika')");
    db.run("INSERT INTO inventory_groups(id,name) VALUES (2, 'Motor')");
    db.run("INSERT INTO inventory_groups(id,name) VALUES (3, 'Fűtéstechnika')");
    db.run("INSERT INTO inventory_groups(id,name) VALUES (4, 'Smart home solution')");

    db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL, cat_id INTEGER NOT NULL, describe TEXT)");

    db.run("INSERT INTO products(name,cat_id,describe) VALUES ('SSD', 1,'')");

    db.run("CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY, product_id INTEGER NOT NULL, stock INTEGER NOT NULL, FOREIGN KEY (product_id) REFERENCES products (id))");

    db.run("INSERT INTO inventory(product_id, stock) VALUES (1, 23)");
    
});
/*
select *
from products p
left join inventory_groups ig on (p.gruop_id = ig.id)
*/

/**
 * SELECT *
 * FROM products
 * LEFT JOIN inventory_groups ON (products.cat_id = inventory_groups.id);
 */
// .headers on
// sqlite> SELECT * FROM products;
// id          name        cat_id      describe  
// ----------  ----------  ----------  ----------
// 1           SSD         1                     
// sqlite> SELECT * FROM products
//    ...> LEFT JOIN inventory_groups ON products.cat_id = inventory_groups.id;
// id          name        cat_id      describe    id          name            
// ----------  ----------  ----------  ----------  ----------  ----------------
// 1           SSD         1                       1           Számítástechnika
// sqlite> SELECT inventory_groups.name FROM products
//    ...> LEFT JOIN inventory_groups ON products.cat_id = inventory_groups.id;
// name            
// ----------------
// Számítástechnika
