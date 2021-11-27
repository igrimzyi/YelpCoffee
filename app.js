const express = require('express'); 
const path = require('path');
const mongoose = require('mongoose');
const coffeeShop = require('./models/coffee')

mongoose.connect('mongodb://localhost:27017/coffee-rate', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once('open', () =>{
    console.log("Database connected");
})
const app = express(); 

app.set('view engine', 'ejs');
app.set('views' , path.join(__dirname, 'views'))

app.get('/', (req,res)=>{
    res.render('home')
});
app.get('/coffeeShops', async(req,res) => {
    const coffeeShops = await coffeeShop.find({});
    res.render('coffeeShops/index', {coffeeShops})
});
app.get('/coffeeShops/new', (req,res)=>{
    res.render('coffeeShops/new')
})
app.post('/coffeeShops', async(req,res)=>{
    res.send(req.body);
})
app.use(express.urlencoded({extended: true}))
app.get('/coffeeShops/:id', async(req, res)=>{
    const coffee = await coffeeShop.findById(req.params.id)
    res.render('coffeeShops/show', {coffee})
})

// app.get('/coffeeShops/:id/edit', async(req, res)=>{
//     const coffee = await coffeeShop.findById(req.params.id)
//     res.render('coffeeShops/edit', {coffee})

// })


app.listen(3000, ()=>{
    console.log("serving on port 3000")
});