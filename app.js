const express = require('express');
const app = express();
const port = 5000;

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const path = require('path');
app.use(express.static(path.join(__dirname, '/public')));

const products = [
    {
        ID: 1,
        Megnevezés: 'Processzor',
        Csoport: 'Számítástechnika'
    },
    {
        ID: 2,
        Megnevezés: 'Processzor',
        Csoport: 'Számítástechnika'
    },
    {
        ID: 3,
        Megnevezés: 'Processzor',
        Csoport: 'Számítástechnika'
    },
    {
        ID: 4,
        Megnevezés: 'Processzor',
        Csoport: 'Számítástechnika'
    },
    {
        ID: 5,
        Megnevezés: 'Processzor',
        Csoport: 'Számítástechnika'
    },
    {
        ID: 6,
        Megnevezés: 'Processzor',
        Csoport: 'Számítástechnika'
    },
    {
        ID: 7,
        Megnevezés: 'Processzor',
        Csoport: 'Számítástechnika'
    }
]

app.get('/',(req,res) => {
    res.render('home',{products:products});
})

app.listen(port, () => {
    console.log(`This app listen on port: ${port}`);
});