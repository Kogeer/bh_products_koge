var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('inventory.db');

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS products (name VARCHAR(100), category VARCHAR(60))")

  
    db.prepare('INSERT INTO products VALUES(?,?)')
  
    .run('Számítástechnika', 'Csoport1')
    .run('Számtech2', 'csoport2')
});

