var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('inventory.db');

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL, category VARCHAR(60) NOT NULL, describe TEXT)");

    db.run("INSERT INTO products(name, category, describe) VALUES ('SSD', 'Számítástechnika','')");
    db.run("INSERT INTO products(name, category, describe) VALUES  ('WQHD Monitor', 'Számítástechnika','')");
    db.run("INSERT INTO products(name, category, describe) VALUES  ('Rámpa fűtés', 'Fűtéstechnika','')");
    db.run("INSERT INTO products(name, category, describe) VALUES  ('Gamer szék', 'Számítástechnika','')");

    db.run("CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY, product_id INTEGER NOT NULL, stock INTEGER NOT NULL, FOREIGN KEY (product_id) REFERENCES products (id))");

    db.run("INSERT INTO inventory(product_id, stock) VALUES (1, 23)");
    db.run("INSERT INTO inventory(product_id, stock) VALUES (2, 2)");
    db.run("INSERT INTO inventory(product_id, stock) VALUES (3, 1)");
    db.run("INSERT INTO inventory(product_id, stock) VALUES (4, 16)");
});
