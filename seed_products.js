var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('inventory.db');

const adjectives = ['Piros','Hordozó','Nagy','Extra','Méteres','Kalózkodó','Nyakas','Kanalas','Cukros','Krémes'];
const pronouns = ['Pulyka','Ököl','Kacsa','Anyahajó','Rakéta','Dynamit','Krumpli','Takaró','Király','Csavarhúzó'];

let words = [];
adjectives.forEach(adjective => {
    pronouns.forEach(pronoun => {
        words.push(`${adjective} ${pronoun}`);
    });
});

function generate() {
    for(let i = 0; i < words.length ; i++) {
        let randomNum = Math.floor(Math.random() * (4 - 1) + 1);
        db.run(`INSERT INTO products(name,cat_id,describe) VALUES ("${words[i]}", "${randomNum}",'')`);
    }
}

db.serialize(function() {
    generate();
});
